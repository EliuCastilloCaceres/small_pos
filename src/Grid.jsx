import './grid.css'

function Grid ({children}){
    return(
        <>
            <div className="container-grid">
                {children}
            </div>
        </>
    )
}

export default Grid