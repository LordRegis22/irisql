import React, { createContext, useState, useEffect } from 'react';

export const ObjectContext = createContext();

export const ObjectContextProvider = (props) => {
  // Default state for objectList
  const defaultObjectList = {
    databaseChoice: 'MongoDB', // the other choice is "PostgreSQL"
    objects: [],
  };
  // objectList will include list of objects with objectNames and a fields array
  const [objectListState, setObjectList] = useState(defaultObjectList);
  /* This state only gets changed when a node is clicked,
   so we can keep track of the current node clicked
   */
  const [nodeObj, setNodeObj] = useState({});
  // This state controls if codemirror editor is rendered or not
  const [viewCode, setViewCode] = useState({
    displayCode: false,
    responseCode: '',
  });

  // useEffect gets invoked when state changes
  useEffect(() => {
    fetch('/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { databaseChoice: objectListState.databaseChoice },
        ...objectListState.objects,
      ]),
    })
      .then((res) => res.json())
      .then((data) => {
        setViewCode({ ...viewCode, responseCode: data });
      })
      .catch((err) => console.log(err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectListState]);

  return (
    <ObjectContext.Provider
      value={[objectListState, setObjectList, nodeObj, setNodeObj, viewCode, setViewCode]}
    >
      {props.children}
    </ObjectContext.Provider>
  );
};
