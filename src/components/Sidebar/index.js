import React, { useContext, useState } from "react";
import { Container, Col, Row, Card, Form, Button } from "react-bootstrap";
import { MapDataContext } from "../../MapDataContext";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

const Sidebar = () => {
  const [
    markers,
    setMarkers,
    selected,
    setSelected,
    twigletLocationToAdd,
    setTwigletLocationToAdd,
  ] = useContext(MapDataContext);

  const handleFormSubmit = (e) => {
    e.preventDefault()
    console.log('handling submit', twigletLocationToAdd)
    setMarkers((current) => [
      ...current,
      {
        address: twigletLocationToAdd.formatted_address,
        lat: twigletLocationToAdd.lat,
        lng:twigletLocationToAdd.lng,
        time: new Date(),
        placeId: e.placeId,
        user: 'Mr Big Twig'
      },
    ]);
  }
  return (
    <Container>
      <Row>
        <Col>
          <Search setTwigletLocationToAdd={setTwigletLocationToAdd} />
        </Col>
      </Row>
      <Row>
        <Col s={12} md={3} className="mx-2 bg-success">
          {markers.map((i) => (
            <div> {i.placeId}</div>
          ))}
        </Col>
      </Row>
      <Row>
      <Col className="mt-3">
          <form onSubmit={(e) => handleFormSubmit(e)}>
          {twigletLocationToAdd != '' ? 
           <Form.Group className="mb-3" style={{width: '300px'}}>
        <Form.Label>Location Address</Form.Label>
        <Form.Control value={twigletLocationToAdd.address_components[0].long_name} placeholder="Use the above autocomplete" disabled />
        <Form.Control value={twigletLocationToAdd.address_components[1].long_name} placeholder="Use the above autocomplete" disabled />
        <Form.Control value={twigletLocationToAdd.address_components[2].long_name} placeholder="Use the above autocomplete" disabled />
        <Form.Control value={twigletLocationToAdd.address_components[3].long_name} placeholder="Use the above autocomplete" disabled />
        <Form.Control value={twigletLocationToAdd.address_components[4].long_name} placeholder="Use the above autocomplete" disabled />
      </Form.Group> : <p> waiting for search</p>}
      <Button type="submit">Submit</Button>
        </form>
       
      </Col>
        {/* {console.log("twigletLocationToAdd", twigletLocationToAdd)} */}
        {/* {twigletLocationToAdd.place_id}
        {twigletLocationToAdd.formatted_address}
        {twigletLocationToAdd.placeId} */}
        {/* {twigletLocationToAdd.lat}
        {twigletLocationToAdd.lng} */}
      </Row>
    </Container>
  );
};

export default Sidebar;

/* ---------------- --*/

function Search({ setTwigletLocationToAdd }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 51.5072, lng: () => -0.1276 },
      radius: 100 * 100,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      // console.log('results', results[0].formatted_address)
      console.log("results", results[0].address_components);
      const { lat, lng } = await getLatLng(results[0]);
      setTwigletLocationToAdd({ 
        ...results[0], 
        lat, 
        lng,

      });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="sidebar-search">
    {console.log('.....ready???',ready)}
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
