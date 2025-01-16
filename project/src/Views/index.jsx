import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import PokeTarjeta from '../Components/PokeTarjeta';
import { PaginationControl } from "react-bootstrap-pagination-control";
import { FaSearch } from 'react-icons/fa';

const Index = () => {
  const [pokemones, setPokemones] = useState([]);
  const [allPokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [total, setTotal] = useState(0);

  const getPokemones = useCallback(async (o) => {
    const liga = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${o}`;
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setListado(respuesta.results);
      setTotal(respuesta.count);
    } catch (error) {
      console.error("Error fetching pokemones:", error);
    }
  }, [limit]);

  const getAllPokemones = async () => {
    const liga = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    try {
      const response = await axios.get(liga);
      const respuesta = response.data;
      setAllPokemones(respuesta.results);
    } catch (error) {
      console.error("Error fetching all pokemones:", error);
    }
  };

  const buscar = async (e) => {
    if (e.keyCode === 13) {
      if (filtro.trim() !== '') {
        setListado(allPokemones.filter(p => p.name.toLowerCase().includes(filtro.toLowerCase())));
      } else {
        setListado(pokemones);
      }
    }
  };

  const goPage = async (page) => {
    setOffset((page - 1) * limit);
    await getPokemones((page - 1) * limit);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getPokemones(offset);
    getAllPokemones();
  }, [offset, getPokemones]);

  return (
    <Container className="shadow bg-danger mt-3">
      <Row className="animate_animated animate_backInDown">
        <Col>
          <InputGroup className="mt-3 mb-3 shadow">
            <InputGroupText>
              <FaSearch /> {}
            </InputGroupText>
            <Input
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              onKeyUpCapture={buscar}
              placeholder="Buscar Pokemon"
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mt-3">
        {listado.length === 0 ? (
          <Col className="text-center fs-2 mb-3">No hay Resultados</Col>
        ) : (
          listado.map((pok, i) => (
            <PokeTarjeta poke={pok} key={i} />
          ))
        )}
        <PaginationControl
          last={true}
          limit={limit}
          total={total}
          page={Math.floor(offset / limit) + 1}
          changePage={goPage}
        />
      </Row>
    </Container>
  );
};

export default Index;