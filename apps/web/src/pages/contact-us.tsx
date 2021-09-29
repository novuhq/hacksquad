import '../styles/wl-styles.less';
import { Widget } from '@typeform/embed-react';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';

export default function ContactUsPage() {
  return (
    <div style={{ minHeight: '500px' }}>
      <NavigationBar />
      <Widget id="CIiYMbNY" style={{ minHeight: '500px', height: '500px' }} className="my-form" />
      <Footer />
    </div>
  );
}
