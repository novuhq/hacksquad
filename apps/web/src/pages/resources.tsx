import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';

export default function Resources() {
  return (
    <>
      <NavigationBar />
      <div className="value-section-dark">
        <div className="container">
          <div className="title-wrapper">
            <div className="w-layout-grid title-grid">
              <div>
                <h3 className="h3-title-white">Where to start</h3>
              </div>
              <div />
            </div>
          </div>
          <div className="w-layout-grid feature-grid-large">
            <a href="https://hacktoberfest.digitalocean.com/" className="value-card-dark w-inline-block">
              <h5 className="h5-title-white">Hacktoberfest</h5>
              <p className="body-medium-300">
                Hosted by DigitalOcean for the 8th year in a row, Hacktoberfest encourages participation in giving back
                to the open source community by completing pull requests, and donating to open source projects.
              </p>
            </a>
            <a href="https://github.com/mungell/awesome-for-beginners" className="value-card-dark w-inline-block">
              <h5 className="h5-title-white">awesome-for-beginners</h5>
              <p className="body-medium-300">
                A list of awesome beginner-friendly projects.Inspired by First Timers Only blog post. If you are looking
                to contribute, then explore this list, look at first-timers-only labelled open issues on Github.
                <br />
              </p>
            </a>
            <a href="https://www.codetriage.com/" className="value-card-dark w-inline-block">
              <h5 className="h5-title-white">CodeTriage</h5>
              <p className="body-medium-300">
                Help out your favorite open source projects and become a better developer while doing it. Pick your
                favorite repos to receive a different open issue in your inbox every day. Fix the issue and everybody
                wins.
                <br />
              </p>
            </a>
          </div>
        </div>
      </div>

      <div className="company-section-dark">
        <div className="container-large">
          <div className="title-wrap-large-centre">
            <div className="title-blue">digging a bit deeper</div>
            <h3 className="h3-title-white margin-bottom-24">Utilities And Guides</h3>
            <p className="body-large-300">
              From awesome lists, commit guides, dedicated sites for contribution, and how to win a t-shirt.
            </p>
          </div>
          <div className="company-pattern-wrapper">
            <div className="w-layout-grid resources-grid">
              <div id="w-node-c6842d2c-2214-f88d-f23f-7dc0b3588b43-b3588b38" className="company-card-dark">
                <div className="title-light-grey">Begginers</div>
                <ul role="list">
                  <li className="list-item-3">
                    <a href="https://github.com/mungell/awesome-for-beginners">
                      <strong>Awesome for Beginners</strong>
                    </a>
                  </li>
                  <li className="list-item-2">
                    <a target="_blank" href="https://up-for-grabs.net/#/">
                      <strong>Up For Grabs</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a target="_blank" href="https://www.firsttimersonly.com/">
                      <strong>First Timers Only</strong>
                    </a>
                  </li>
                </ul>
                <div className="title-light-grey mt20">intermediates</div>
                <ul role="list">
                  <li className="list-item-3">
                    <a href="https://github.com/mungell/awesome-for-beginners">
                      <strong>Pull Request Roulette</strong>
                    </a>
                  </li>
                  <li className="list-item-2">
                    <a href="https://up-for-grabs.net/#/">
                      <strong>CodeTriage</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a target="_blank" href="https://www.firsttimersonly.com/">
                      <strong>How to Contribute to Open Source</strong>
                    </a>
                  </li>
                </ul>
              </div>
              <div id="w-node-_600e6cb0-b20d-9c25-5efc-5401bd90ec08-b3588b38" className="company-card-dark">
                <div className="title-light-grey">Guides &amp; tutorials</div>
                <ul role="list">
                  <li className="list-item-2">
                    <a href="https://guides.github.com/introduction/flow/">
                      <strong>Understanding the GitHub Flow</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a href="https://www.digitalocean.com/community/tutorial_series/an-introduction-to-open-source">
                      <strong>An Introduction to Open Source</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a href="https://opensource.com/article/19/5/how-get-job-doing-open-source">
                      <strong>Boost your career with open source</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a href="https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/">
                      <strong>How to write the perfect pull request</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a href="https://dev.to/chrissiemhrk/git-commit-message-5e21">
                      <strong>How to write a good commit message</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a
                      target="_blank"
                      href="https://medium.com/android-news/the-beginners-guide-to-hacktoberfest-2019-winning-the-t-shirt-1a03b67e68">
                      <strong>The Beginner’s Guide to Hacktoberfest 2020</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a href="https://dev.to/mindninjax/hacktoberfest-guide-for-beginners-3dp6">
                      <strong>Hacktoberfest Guide for Beginners</strong>
                    </a>
                  </li>
                  <li className="list-item-4">
                    <a href="https://towardsdatascience.com/a-data-scientists-guide-to-hacktoberfest-8135b8bf2c01">
                      <strong>A Data Scientist’s Guide to Hacktoberfest</strong>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <img
              src="https://uploads-ssl.webflow.com/6130b55cdc153dd345632ef1/6130b55cdc153d5539632f88_Company%20Pattern%20Dark.svg"
              loading="lazy"
              data-w-id="c6842d2c-2214-f88d-f23f-7dc0b3588b5f"
              alt=""
              className="pattern"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
