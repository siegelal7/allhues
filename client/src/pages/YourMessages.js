// import Axios from "axios";
import React, { useState, useContext, useEffect } from "react";
// import API from "../utils/API";
// import useDidMountEffect from "../utils/useDidMountEffect";
import UserContext from "../utils/UserContext";
import Message from "../components/Message/Message";
import { Link } from "react-router-dom";
import Axios from "axios";
import Modal from "react-modal";
import useDidMountEffect from "../utils/useDidMountEffect";

Modal.setAppElement("#root");

const YourMessages = () => {
  const [yourMsgs, setYourMsgs] = useState([]);
  const [sentMsgs, setSentMsgs] = useState([]);

  const { id } = useContext(UserContext);

  useEffect(() => {
    Axios.get(`/api/messages/${id}`)
      .then((res) => {
        setSentMsgs(res.data[0].sentMessages);
        setYourMsgs(res.data[0].receivedMessages);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSentDeleteClick = (e) => {
    e.stopPropagation();
    // console.log(e.target.getAttribute("data"));
    var idToDelete = e.target.getAttribute("data");

    Axios.delete(`/api/sentmessages/${idToDelete}`)
      .then((res) => {
        // console.log(res.data);
        const filteredSent = sentMsgs.filter((i) => i._id != idToDelete);
        setSentMsgs(filteredSent);
      })
      .catch((err) => console.log(err));
  };

  const handleReceivedDeleteClick = (e) => {
    e.stopPropagation();
    var idToDelete = e.target.getAttribute("data");

    Axios.delete(`/api/receivedmessages/${idToDelete}`)
      .then((res) => {
        // console.log(res.data)
        const filteredSent = yourMsgs.filter((i) => i._id != idToDelete);
        setYourMsgs(filteredSent);
      })
      .catch((err) => console.log(err));
  };

  // ---- Modal ----
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleCloseBtnClick = () => {
    setModalIsOpen(false);
  };

  const [messageThreadUsername, setMessageThreadUsername] = useState("");
  // const [filteredSent, setFilteredSent] = useState([]);
  // const [filteredReceived, setFilteredReceived] = useState([]);
  const [allFilteredMessages, setAllFilteredMessages] = useState([]);
  const [uniqueUsernames, setUniqueUsernames] = useState([]);


  const handleShowMessages = (e) => {
    setModalIsOpen(true);
    // console.log(yourMsgs);

    setMessageThreadUsername(e.target.getAttribute("class"));
  }

  useDidMountEffect(() => {
    const r = [];
    for (let i=0; i<sentMsgs.length; i++) {
      for(let j=0; j<sentMsgs.length; j++) {
      if(!r.includes(sentMsgs[i].receiverUsername)) {
        r.push(sentMsgs[i].receiverUsername);
      }
      }
    }
    console.log(r);
    setUniqueUsernames(r);
  }, [sentMsgs])

  useDidMountEffect(() => {
    const r = [];
    for (let i=0; i<yourMsgs.length; i++) {
      for(let j=0; j<yourMsgs.length; j++) {
      if(!r.includes(yourMsgs[i].senderUsername)) {
        r.push(yourMsgs[i].senderUsername);
      }
      }
    }
    console.log(r);
    setUniqueUsernames(r);
  }, [yourMsgs])

  useDidMountEffect(() => {
    console.log(messageThreadUsername);
    const showSent = yourMsgs.filter(name => name.senderUsername === messageThreadUsername)
    // yourMsgs.filter(name => console.log(name.senderUsername))
    // setFilteredSent(showSent);

    const showReceived = sentMsgs.filter(name => name.receiverUsername === messageThreadUsername)
    // setFilteredReceived(showReceived);

    const allFilteredMessagesArray = showSent.concat(showReceived);
    const x = allFilteredMessagesArray.sort((a, b) => b.createdDate - a.createdDate);
    setAllFilteredMessages(x);
    console.log(x);

  }, [messageThreadUsername])

  // ---------------

  if (
    sentMsgs != undefined 
    && yourMsgs != undefined 
    &&
    sentMsgs.length > 0 &&
    yourMsgs.length > 0
  ) {
    return (
      <>
      <div>
      <br />
      <h3>Click on a username to view messages:</h3>
      <br />
        {/* Map over users who have messaged with this person */}
        {uniqueUsernames &&
            uniqueUsernames.map((i) => (
              // i.senderUsername
              <p>
                <a className={i}
                onClick={(e) => handleShowMessages(e)}>
                {i}
                </a>
              </p>
            ))
        }
        {/* ------------------------------------------------- */}

    <Modal
        isOpen={modalIsOpen}
        className="modal-content"
      >
    <div>
      <h4>Messages with {messageThreadUsername}</h4>
      <br />
        {/* <h5 style={{ fontWeight: "bold" }}>Sent Messages</h5> */}
        <div
          className="container-fluid"
          style={{ width: "fit-content", minWidth: "45vw" }}
        >
            {/* {filteredReceived &&
              filteredReceived.map((i) => (
                <Message
                  key={i._id}
                  info={i}
                  url={i._id}
                  handleDeleteClick={(e) => handleSentDeleteClick(e)}
                />
              ))}
            {filteredSent &&
              filteredSent.map((i) => (
                <Message
                  key={i._id}
                  info={i}
                  url={i._id}
                  handleDeleteClick={(e) => handleReceivedDeleteClick(e)}
                />
              ))} */}
        {allFilteredMessages &&
              allFilteredMessages.map((i) => (
                <ul style={{listStyle:"none"}}>
                  <li>
                <Message
                  key={i._id}
                  info={i}
                  url={i._id}
                  handleDeleteClick={(e) => handleReceivedDeleteClick(e)}
                />
                  </li>
                </ul>
          ))}
        </div>
        <button
            className="buttons shadow-none py-0 px-2 text-muted"
            onClick={handleCloseBtnClick}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              color: "black",
              backgroundColor: "white",
              border: "none",
            }}
          >
            <h3>&times;</h3>
    </button>
    </div>
    </Modal>
    </div>
      </>
    );
  } 
  // else if (
  //   (yourMsgs != undefined && yourMsgs.length > 0) ||
  //   (sentMsgs != undefined && sentMsgs.length > 0)
  // ) {
  //   return (
  //     <>
  //     <Modal
  //       isOpen={modalIsOpen}
  //       className="modal-content"
  //     >
  //   <div>
  //     <h4>Messages with {messageThreadUsername}</h4>
  //     <br />
  //       {/* <h5 style={{ fontWeight: "bold" }}>Sent Messages</h5> */}
  //       <div
  //         className="container-fluid"
  //         style={{ width: "fit-content", minWidth: "45vw" }}
  //       >
  //           {
  //           sentMsgs &&
  //             sentMsgs
  //             .map((i) => (
  //               <Message
  //                 key={i._id}
  //                 url={i._id}
  //                 info={i}
  //                 handleDeleteClick={(e) => handleSentDeleteClick(e)}
  //               />
  //             ))}
  //       </div>
  //       {yourMsgs != undefined && yourMsgs.length > 0 && (
  //         <>
  //           <h5 style={{ fontWeight: "bold" }}>Received Messages</h5>
  //           <div
  //             className="container-fluid"
  //             style={{ width: "fit-content", minWidth: "45vw" }}
  //           >
  //               {yourMsgs &&
  //                 yourMsgs.map((i) => (
  //                   <Message
  //                     key={i._id}
  //                     info={i}
  //                     url={i._id}
  //                     handleDeleteClick={(e) => handleReceivedDeleteClick(e)}
  //                   />
  //                 ))}
  //           </div>
  //         </>
  //       )}
  //       <button
  //           className="buttons shadow-none py-0 px-2 text-muted"
  //           onClick={handleCloseBtnClick}
  //           style={{
  //             position: "absolute",
  //             right: 0,
  //             top: 0,
  //             color: "black",
  //             backgroundColor: "white",
  //             border: "none",
  //           }}
  //         >
  //           <h3>&times;</h3>
  //       </button>
  //       </div>
  //       </Modal>
  //     </>
    // );
  // }

  return (
    <>
      <h4>
        No messages yet... <Link to="/newmessage">Send a message?</Link>
      </h4>
    </>
  );
};

export default YourMessages;
