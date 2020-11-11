import React from "react";

const AddedAffiliateLink = ({ affiliateLink, removeKitItem, id, makeupCategory }) => {
  return (
    // <div className="input-group mb-3">
    //   <input
    //     type="text"
    //     className="form-control"
    //     id="kitItemsInput"
    //     value={affiliateLink}
    //     disabled
    //   />
      // <div className="input-group-append">
      //   <button className="btn btn-outline-secondary" type="button" onClick={removeKitItem} id={id}>
      //     Remove
      //   </button>
      // </div>
    // </div>

    <div className="row no-gutters">
      <div className="col-sm-11 input-group">
      <input
        type="text"
        className="form-control"
        id="kitItemsInput"
        value={affiliateLink}
        disabled
      />
            <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="button" disabled>
          {makeupCategory}
        </button>
      </div>
      </div>
      <div className="col-sm-1 d-flex justify-content-between">
      <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={removeKitItem}
          id={id}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default AddedAffiliateLink;
