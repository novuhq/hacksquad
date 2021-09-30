import '../styles/wl-styles.less';
import { Widget } from '@typeform/embed-react';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';

export default function ContactUsPage() {
  return (
    <div style={{ minHeight: '500px' }}>
      <NavigationBar />
      <Widget id="CIiYMbNY" style={{ minHeight: '500px', height: '500px' }} className="my-form" />
      <div className="content-section-dark">
        <div className="container-small">
          <div className="article white-label w-richtext">
            <h4>Just want to ask something?</h4>
            <p>
              Or contact us directly
              <strong>
                <em> hello@notifire.co </em>
              </strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
