import express from 'express';
import bodyParser from 'body-parser';
import exhbs from 'express-handlebars';
import path from 'path';
import favicon from 'serve-favicon';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import controllers from './controllers';
import clientsApi from './controllers/api/clients';
import helpers from './views/helpers';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  exhbs({
    extname: 'hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: 'main',
    helpers,
  }),
);
app.use(fileUpload());
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

app.use(controllers);
app.use('/api/v1', clientsApi);

app.use((req, res) => {
  res.status(404).render('error', {
    layout: 'error',
    statusCode: 404,
    errorMsg: 'THE PAGE YOU ARE LOOKING FOR MIGHT HAVE BEEN REMOVED, HAD ITS NAME CHANGED OR IS TEMPORARILY UNAVAILABLE',
  });
});


app.use((err, req, res, next) => {
  if (err.isJoi) {
    res.status(401).send('Unauthorized');
  } else {
    console.error('505 server error', err);
    res.status(500).render('error', {
      statusCode: 500,
      errorMsg: 'Internal server error',
      layout: 'error',
    });
  }
});

export default app;
