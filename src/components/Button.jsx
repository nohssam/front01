export default function Button({text, onClick}){
    return(
        <button onClick={onClick} style={{padding:"10px", cursor:"pointer", marginLeft:"10px"}}>{text}</button>
    )
}