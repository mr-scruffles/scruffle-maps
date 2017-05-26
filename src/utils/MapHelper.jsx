import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

// Build the infow window for a marker.
export const buildInfoWindow = (details, callback = null, isFavorite = false) => {
  const containerElement = document.createElement('div');
  let context = 'btn btn-success btn-sm';
  let buttonText = 'Favorite';
  if (isFavorite) {
    context = 'btn btn-danger btn-sm';
    buttonText = 'Un-Favorite';
  }

  ReactDOM.render(
    (<div className="container">
      <div className="row">
        <h6 className="text-capatilize">{details.name || 'Unavailable'}</h6>
      </div>
      <dl className="row">
        <dt className="col-sm-2"><i className="fa fa-phone" /></dt>
        <dd className="col-sm-10">{details.formatted_phone_number || 'Unavailable'}</dd>
        <dt className="col-sm-2"><i className="fa fa-link" /></dt>
        <dd className="col-sm-10"><a href={details.website} target="_blank" rel="noreferrer noopener">Website</a></dd>
        <dt className="col-sm-2"><i className="fa fa-star" style={{ color: 'GoldenRod' }} /></dt>
        <dd className="col-sm-10">{details.rating || 'Unavailable'}</dd>
        <dt className="col-sm-2"><i className="fa fa-floppy-o" /></dt>
        <dd className="col-sm-10"><button className={context} type="button" onClick={callback}>{buttonText}</button></dd>
      </dl>
    </div>
    ), containerElement);
  return containerElement;
};

// Find if marker is a favorite.
export const hasFavorite = (markers, target) => {
  const idx = _.findIndex(markers, marker => marker.place.placeId === target && marker.type === 'db');
  return idx >= 0;
};
