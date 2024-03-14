import './dashboardCard.css'
function DashboardCard({ value, description, iconClassName }) {
    return (
        <div className="dashboard-card">
            <section className='info-card-section'>
                <div className="info-wrapper ">
                    <span className='value'>{value}</span>
                    <span className='description'>{description}</span>
                </div>
            </section>
            <section className='icon-section'>
                <i className={iconClassName}></i>
            </section>
        </div>
    )
}

export default DashboardCard