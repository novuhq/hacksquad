import Link from 'next/link';
import '../styles/wl-styles.less';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';

export default function AssetsPage() {
  return (
    <>
      <NavigationBar />
      <div className="header">
        <div className="container">
          <h1 className="heading-white">Logos &amp; Assets</h1>
        </div>
      </div>
      <div className="content-section-dark">
        <div className="container-small">
          <div className="article white-label w-richtext">
            <p>
              <strong>
                <em>
                  Here You can find our logos and brand assets, for more media inquires and other information, email us
                  at hello@hack-squad.dev
                </em>
              </strong>
            </p>
          </div>
        </div>
        <div className="container-large">
          <div className="w-layout-grid feature-grid-small">
            <a href="hacksquad-white.png" target="_blank" download>
              <div className="testimoinal-card-dark w-form-label">
                <img src="hacksquad-white.png" />
              </div>
            </a>

            <a href="hacksquad-color.png" target="_blank" download>
              <div className="testimoinal-card-white w-form-label">
                <img src="hacksquad-color.png" />
              </div>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
