
import { importAll } from 'blognami';
// First, so the R2 `blobStore` registers after the disk one whatever order a project imports in.
import '@blognami/blob-store';
import '@blognami/bundler';

importAll(import.meta.url);
