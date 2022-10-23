
import 'blognami';
import { importAll } from 'pinstripe';
import 'pinstripe/multi-app';

if(process.env.TENANCY == 'multi') import('pinstripe/multi-tenant');

importAll(import.meta.url);
