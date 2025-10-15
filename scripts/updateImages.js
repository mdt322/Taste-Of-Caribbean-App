import { updateMenuWithImages } from '../src/utils/imageUpload';

// Run the update
updateMenuWithImages()
  .then(() => console.log('Finished updating menu items'))
  .catch(error => console.error('Error:', error));
