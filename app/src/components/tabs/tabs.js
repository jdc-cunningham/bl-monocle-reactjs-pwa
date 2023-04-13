import './tabs.scss';

const Tabs = (props) => {
  const { tabs, activeTab } = props;

  return (
    <div className="Tabs">
      {tabs.map((tab, index) => <div key={index} className={`Tabs__tab ${activeTab === tab ? 'active' : ''}`}>{tab}</div>)}
    </div>
  );
}

export default Tabs;