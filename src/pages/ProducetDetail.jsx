import { useParams } from "react-router-dom"

export default function ProducetDetail(){
    const {id} = useParams();
    
    return(
        <div>
            상품 상세 보기 : {id}
        </div>
    )
}