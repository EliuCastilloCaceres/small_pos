import './gridCard.css'

function GridCard ({onClick, children}){
    return (
        <>
            <div onClick={onClick} className="grid-card">
                 {children}
            </div>
        </>
    )
}

export default GridCard