import './apps.scss';
import WorkoutIcon from './app-icons/workout_icon.JPG';
import HNIcon from './app-icons/hn_icon.JPG';
import RedditIcon from './app-icons/reddit_icon.JPG';

const Apps = () => {
  const apps = [
    {
      name: 'Workout',
      icon: WorkoutIcon,
    },
    {
      name: 'HN News Reader',
      icon: HNIcon,
    },
    {
      name: 'Reddit News Reader',
      icon: RedditIcon,
    },
  ];

  return (
    <div className="TabContent__Apps">
      {apps.map((app, index) =>
        <div key={index} className="TabContent__app">
          <img src={app.icon} alt="app icon"/>
          <h4>{app.name}</h4>
        </div>
      )}
    </div>
  );
}

export default Apps;