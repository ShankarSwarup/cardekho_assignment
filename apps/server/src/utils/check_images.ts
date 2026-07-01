import axios from 'axios';

const urls: Record<string, string> = {
  'Swift': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
  'i20': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  'Nexon': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  'Nexon EV': 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
  'City': 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&q=80',
  'Fortuner': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
  'XUV700': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80',
  '3 Series': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
  'Slavia': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
  'Virtus': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80'
};

const checkUrls = async () => {
  for (const [model, url] of Object.entries(urls)) {
    try {
      const res = await axios.head(url, { timeout: 8000 });
      console.log(`${model} => SUCCESS (${res.status})`);
    } catch (err: any) {
      console.log(`${model} => FAILED (${err.message})`);
    }
  }
};

checkUrls();
