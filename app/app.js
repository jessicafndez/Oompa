console.log('Hello from Webpack');

global.jQuery = global.$ = require('jquery');
import 'bootstrap/dist/js/bootstrap';

import '../js/opaApi.js';


//Styles
require('../css/colors.less');
require('../css/generalStyles.less');
require('../css/indexViewStyles.less');
require('../css/singleViewStyles.less');
