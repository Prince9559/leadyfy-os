import "./StatCard.css";

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <h3 className="stat-card-value">{value}</h3>
        </div>

        {Icon && (
          <div className="stat-card-icon">
            <Icon size={22} />
          </div>
        )}
      </div>

      {description && (
        <p className="stat-card-description">{description}</p>
      )}
    </div>
  );
}

export default StatCard;