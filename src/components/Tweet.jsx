import '../styles/Tweet.css'

function Tweet({name, handle,data,srcImg,isMessage}){


    return (
        <div className="tweet">
            {/* <div className="user-photo">
                <img src={srcImg} alt="" />
            </div> */}
            <div></div>
           <div className="main">
                <div className="user-info">
                    <div className="name">{name}</div>
                    <div className="handle">@{handle}</div>
                </div>
                <div className="data">{data}</div>
                {
                    isMessage && 
                    <></>
                }
           </div>
       </div>
    )

}

export default Tweet;