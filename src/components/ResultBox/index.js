import React, { useContext, useState } from "react";
import { formatRelative } from "date-fns";
import { Button } from "react-bootstrap";
import { MapDataContext } from "../../MapDataContext";
import axios from "axios";

const ResultBox = ({
  formattedAddress,
  name,
  address,
  user,
  time,
  twiglet_id,
  votes,
  twiglet,
}) => {
  console.log('result box',twiglet)
  const [disable, setDisable] = useState(false);

  const removeDeletedItem = (id) => {
    setAllTwiglets((current) =>
      current.filter((twiglet) => {
        return twiglet.twiglet_id !== id;
      })
    );
  };

  // const updateVoteCountLocal = (id) => {
  //   allTwiglets((current) =>
  //   current.map((twiglet) => {
  //      if(twiglet.twiglet_id === id){
  //       twiglet.votes++
  //      };
  //   })
  // );
  // }

  const addTwigletVote = async () => {
    const { data } = await axios.patch(
      `https://test-twiglets.herokuapp.com/twiglets/${twiglet_id}/`
    );
    setDisable(true);
    // updateVoteCountLocal(twiglet_id)
    console.log(data);
  };

  const deleteTwiglet = async () => {
    const { data } = await axios.delete(
      `https://test-twiglets.herokuapp.com/twiglets/${twiglet_id}/`
    );
    console.log(data);
    removeDeletedItem(twiglet_id);
  };
  const [
    markers,
    setMarkers,
    selected,
    setSelected,
    twigletLocationToAdd,
    setTwigletLocationToAdd,
    allTwiglets,
    setAllTwiglets,
    loading,
    setLoading,
    gotoTwiglet,
    setGotoTwiglet,
  ] = useContext(MapDataContext);
  return (
    <div className="box">
      <p className="my-0 text-white">
        <strong>Name:</strong>
        {name}
      </p>
      <p className="my-0 text-white">
        <strong>Location:</strong>
        {address}
      </p>
      <p className="my-0 text-white">
        <strong>Found by:</strong> {user}{" "}
      </p>
      {/* <p className="my-0"> <strong>Date found:</strong> {formatRelative(time, new Date())}</p> */}
      <p className="my-0 text-white">
        {" "}
        <strong>Date found:</strong> {time}
        <p>Votes: {votes}</p>
        <Button disabled={disable} onClick={addTwigletVote}>
          Up Vote
        </Button>
        <Button onClick={deleteTwiglet}>Delete</Button>
        <Button onClick={() => setGotoTwiglet(twiglet)}>Goto</Button>
      </p>
    </div>
  );
};

export default ResultBox;
