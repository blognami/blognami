
import 'blognami';
import { importAll } from 'sintra';
import 'sintra/multi-app';

if(process.env.TENANCY == 'multi') import('sintra/multi-tenant');

importAll(import.meta.url);
