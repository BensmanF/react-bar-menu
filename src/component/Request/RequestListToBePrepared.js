import React from "react";
import { getBtnData } from "../../api/Api.js";
import { app } from "../../config-firebase/firebase.js";

import { fetchInDataChanges } from "../../api/Api.js";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import "../../assets/styles/RequestListToBePrepared.css";
import { Link } from "react-router-dom";

const RequestListToBePrepared = () => {
  const db = getFirestore(app);

  const [requestsDoneList, setRequestDoneList] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = fetchInDataChanges("request", (data) => {
      console.log("data   ", data);
      const requestList = data.filter((item) => item.done == true);
      setRequestDoneList(requestList);
    });
    return () => unsubscribe();
  }, []);

  function getFirstFourLetters(inputString) {
    // Retorna os 4 primeiros caracteres da string
    return inputString.slice(0, 4);
  }

  const fetchUserRequests = async () => {
    let requestList = await getBtnData("request");
    console.log("Objeto inteiro   ", requestList);
    requestList = requestList.filter((item) => item.done == true);
    setRequestDoneList(requestList);
  };

  const RequestDone = (item) => {
    item.done = false;
    setDoc(doc(db, "request", item.id), item)
      .then(() => {
        console.log("Document successfully updated !");
        fetchUserRequests();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const changeStatusPaid = (item) => {
    item.paymentDone = true;
    setDoc(doc(db, "request", item.id), item)
      .then(() => {
        console.log("Document successfully updated !");
        fetchUserRequests();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="container-btn-request">
        <Link className="all-request" to="/requestlistcheck">
          Todos os pedidos
        </Link>
      </div>
      {requestsDoneList &&
        requestsDoneList.map((item) => (
          <div className="container-requestListToBePrepared">
            <div className="user-container">
              <div>
                <p>
                  <span>Nome</span> {item.name}
                </p>
                <p>
                  <span>Pedido</span>: {getFirstFourLetters(item.id)} ;
                </p>
                <p>
                  <span>Mesa</span>: 12
                </p>
                <p>
                  <span>Data</span> {item.dateTime}
                </p>
                <h2>Valor final {item.finalPriceRequest}</h2>
              </div>
              <div className="btn-status">
                <button
                  disabled={!item.paymentDone}
                  className={item.done ? "done" : "pendent"}
                  onClick={() => RequestDone(item)}
                >
                  Pronto
                </button>
                <button
                  className={item.paymentDone ? "done" : "pendent"}
                  onClick={() => changeStatusPaid(item)}
                >
                  Pago
                </button>
              </div>
            </div>

            {item.request &&
              item.request.map((item) => (
                <div className="request-item">
                  <div>
                    <h5>{item.name}</h5>
                    <h5>Acompanhamento</h5>
                    <div className="sideDishes-list">
                      {item.sideDishes && item.sideDishes.length > 0 ? (
                        item.sideDishes.map((item) => <p>{item},</p>)
                      ) : (
                        <p>Não tem acompanhamento</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <img src={item.image} alt="123" />
                    <button className="btn btn-warning">Receita</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      ;
    </div>
  );
};
export default RequestListToBePrepared;
