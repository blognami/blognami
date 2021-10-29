

import { defineService } from 'pinstripe';

import { View } from '../view.js';

defineService('view', environment => View.create('index', environment));
