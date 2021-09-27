import '../styles/wl-styles.less';
import { NavigationBar } from '../components/shared/NavBar';
import { Footer } from '../components/landing';

export default function RulesPage() {
  return (
    <>
      <NavigationBar />
      <div className="header">
        <div className="container">
          <h1 className="heading-white">Competition Rules</h1>
        </div>
      </div>
      <div className="content-section-dark">
        <div className="container-small">
          <div className="article white-label w-richtext">
            <h3>Have Fun</h3>
            <p>
              <strong>
                <em>
                  Following are the rules for competing in HackSquad competition. Prior we would like to remind you this
                  is a friendly competition. Built and designed to help all of us grow as individuals, code better,
                  participate and contribute to our community, and lastly commit some meaningful code. enjoy!
                </em>
              </strong>
            </p>
            <p>
              <strong>TLDR;</strong>
            </p>
          </div>
          <div className="w-row">
            <div className="column w-col w-col-6">
              <div className="div-good">
                <div className="section wf-section">
                  <h4 className="h4-title-white h4-no-space">What To Do</h4>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Join Team
</h5>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Invite Friends
</h5>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Contribute Meaningful Code
</h5>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Win Badge and Swag
</h5>
                </div>
              </div>
            </div>
            <div className="column-2 w-col w-col-6">
              <div className="div-block-3">
                <div className="section wf-section">
                  <h4 className="h4-title-white h4-no-space">What Not To Do</h4>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Spam Commits
</h5>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Abuse Teams
</h5>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Bad Repos
</h5>
                </div>
                <div className="section wf-section">
                  <h5 className="h4-title-white h4-no-space">
                    <span className="text-span-2"> </span>
{' '}
Igonred Commits or Ban
</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="article white-label w-richtext">
            <h4>Rules</h4>
            <ol role="list">
              <li>
                Competition is for teams, a team can be from 1-5 participants, we encourage you to invite your friends and
                colleagues to fill your team, maximum of 1 team per user.
              </li>
              <li>
                Just like hacktoberfest, we require a minimal amount of commits in order to qualify, a minimum of 15
                commits per team are required.
              </li>
              <li>
                Competition will be on a global scope, i.e. team with the most commits will win 1st place. Coding languages,
                location, companies, will be used for statistics, comparison, but not for local scope competition.
              </li>
              <li>
                Only meaningful and approved (merged or not) commits will be counted. If you are using bots, scripts, or
                spam pull request or not counted, teams who does that might be dropped from the competition. See more.
              </li>
              <li>
                Bad repos, i.e., approval of bad commits, not flagging spam as spam, or any type of bad behavior may
                omitted.
              </li>
            </ol>
            <h4>Winning</h4>
            <p>
              A team that won, don't worry, we will let you, and everyone else know :), will be contacted to get thier
              address for shipment of the swag kit, as well as each will get a digital badge, with thier name, team
              name, position, year, just to show off.{' '}
            </p>
            <h5>Note</h5>
            <p>
              For further explanation feel free to contact us and ask you questions. Please refer to the official
              <a href="https://hacktoberfest.digitalocean.com/resources/participation" target="_blank">
                hacktoberfest rules
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
