
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from 'reactstrap';
import { FaArrowRight } from 'react-icons/fa'; 

const PokeTarjeta = (params) => {
  const [pokemon, setPokemon] = useState({}); 
  const [imagen, setImagen] = useState('');
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoadClass] = useState('');

  useEffect(() => {
    const getPokemon = async () => {
      if (params.poke && params.poke.url) {
        const liga = params.poke.url;
        try {
          const response = await axios.get(liga);
          const respuesta = response.data;
          setPokemon(respuesta);

          // Establece imagen del Pokémon
          if (respuesta.sprites.other.dream_world.front_default) {
            setImagen(respuesta.sprites.other.dream_world.front_default);
          } else {
            setImagen(respuesta.sprites.other['official-artwork'].front_default);
          }

          // Muestra la tarjeta y oculta el indicador de carga
          setCardClass('');
          setLoadClass('d-none');
        } catch (error) {
          console.error("Error fetching Pokémon data:", error);
        }
      }
    };

    getPokemon();
  }, [params.poke]); 

  return (
    <Col xs={12} md={6} lg={4} xl={3} className="mb-3">
      <Card className={`shadow border-4 border-warning ${loadClass} w-100`}>
        <CardImg src='./img/pokeball.gif' height='200' className='p-3' />
      </Card>
      <Card className={`animate_animated animate_zoomIn card-hover shadow border-4 border-warning ${cardClass} w-100`}>
        <CardImg src={imagen} height='150' className='p-2' />
        <CardBody className='text-center p-0 overflow-hidden'>
          {pokemon && pokemon.id && <Badge pill color='danger'># {pokemon.id}</Badge>}
          {pokemon && pokemon.name && <label className='fs-4 text-capitalize'>{pokemon.name}</label>}
        </CardBody>
        <CardFooter className='bg-warning p-0 overflow-hidden'>
          {pokemon && pokemon.name && (
            <Link to={`/pokemon/${pokemon.name}`} className='btn btn-dark w-100'>
              <FaArrowRight /> Detalle
            </Link>
          )}
        </CardFooter>
      </Card>
    </Col>
  );
}


export default PokeTarjeta;