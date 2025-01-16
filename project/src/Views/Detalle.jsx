import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Badge, Progress } from 'reactstrap';
import axios from 'axios';
import { FaFire, FaTint, FaLeaf, FaBolt, FaHeart, FaShieldAlt, FaRunning } from 'react-icons/fa'; // Importar íconos de Font AwesomeS
import { FaHome } from 'react-icons/fa'; 

const Detalle = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState({ name: '' });
  const [especie, setEspecie] = useState({ name: '' });
  const [habitat, setHabitat] = useState('Desconocido');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('/img/pokeball.gif'); 
  const [tipos, setTipos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [cardClass, setCardClass] = useState('d-none'); 

  const getPokemon = useCallback(async () => {
    try {
      const liga = `https://pokeapi.co/api/v2/pokemon/${id}`;
      const response = await axios.get(liga);
      const respuesta = response.data;
      setPokemon(respuesta);

      // Establece la imagen del Pokémon
      if (respuesta.sprites.other.dream_world.front_default) {
        setImagen(respuesta.sprites.other.dream_world.front_default);
      } else {
        setImagen(respuesta.sprites.other['official-artwork'].front_default);
      }

      // Obtener tipos
      const tiposPromises = respuesta.types.map(async (t) => {
        const tipoResponse = await axios.get(t.type.url);
        return tipoResponse.data.names[5].name;
      });
      const tiposResultados = await Promise.all(tiposPromises);
      setTipos(tiposResultados);

      // Obtener habilidades
      const habilidadesPromises = respuesta.abilities.map(async (h) => {
        const habilidadResponse = await axios.get(h.ability.url);
        return habilidadResponse.data.names[5].name;
      });
      const habilidadesResultados = await Promise.all(habilidadesPromises);
      setHabilidades(habilidadesResultados);

      // Obtener estadosticas
      const estadisticasPromises = respuesta.stats.map(async (s) => {
        const statResponse = await axios.get(s.stat.url);
        return { nombre: statResponse.data.names[5].name, valor: s.base_stat };
      });
      const estadisticasResultados = await Promise.all(estadisticasPromises);
      setEstadisticas(estadisticasResultados);

      // Obtener especie
      const especieResponse = await axios.get(respuesta.species.url);
      setEspecie(especieResponse.data);

      // Obtener habitat
      if (especieResponse.data.habitat) {
        const habitatResponse = await axios.get(especieResponse.data.habitat.url);
        setHabitat(habitatResponse.data.names[1].name);
      }

      // Obtener descripcion
      const descripcionEncontrada = especieResponse.data.flavor_text_entries.find(
        (entry) => entry.language.name === 'es'
      );
      setDescripcion(descripcionEncontrada?.flavor_text || 'No disponible');

      // Mostrar la tarjeta
      setCardClass('');
    } catch (error) {
      console.error("Error al obtener los datos del Pokémon:", error);
      setCardClass(''); 
    }
  }, [id]);

  useEffect(() => {
    getPokemon();
  }, [id, getPokemon]);

  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <Container style={{ fontSize: '18px' }}>
      <Row className="mt-4 mb-4">
        <Col xs={12} md={6} className="d-flex justify-content-center">
          <button type="button" className="btn btn-secondary ms-2" onClick={handleHome}>
            <FaHome /> Volver al Inicio
          </button>
        </Col>
      </Row>
      <Row className={cardClass}>
        <Col>
          <Card className="detalle-card shadow border-4 border-warning">
            <CardBody>
              <div>
                <img src={ imagen} alt={pokemon.name} className="img-fluid" />
                <h2 style={{ fontSize: '24px' }}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
                <div>
                  <p><strong>Especie:</strong> {especie.name.charAt(0).toUpperCase() + especie.name.slice(1)}</p>
                  <p><strong>Hábitat:</strong> {habitat.charAt(0).toUpperCase() + habitat.slice(1)}</p>
                  <p><strong>Descripción:</strong> {descripcion.charAt(0).toUpperCase() + descripcion.slice(1)}</p>
                </div>
                <div>
                  <h4>Tipos:</h4>
                  {tipos.map((tipo, index) => {
                    let icon;
                    switch (tipo) {
                      case 'fire':
                        icon = <FaFire />;
                        break;
                      case 'water':
                        icon = <FaTint />;
                        break;
                      case 'grass':
                        icon = <FaLeaf />;
                        break;
                      case 'electric':
                        icon = <FaBolt />;
                        break;
                      case 'fighting':
                        icon = <FaHeart />;
                        break;
                      case 'rock':
                        icon = <FaShieldAlt />;
                        break;
                      case 'speed':
                        icon = <FaRunning />;
                        break;
                      default:
                        icon = null;
                    }
                    return (
                      <Badge key={index} color="primary" className="me-1">
                        {icon} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </Badge>
                    );
                  })}
                </div>
                <div>
                  <h4>Habilidades:</h4>
                  {habilidades.map((habilidad, index) => (
                    <Badge key={index} color="success" className="me-1">{habilidad.charAt(0).toUpperCase() + habilidad.slice(1)}</Badge>
                  ))}
                </div>
                <div>
                  <h4>Estadísticas:</h4>
                  {estadisticas.map((stat, index) => (
                    <div key={index}>
                      <strong>{stat.nombre.charAt(0).toUpperCase() + stat.nombre.slice(1)}:</strong> <Progress value={stat.valor} max="255" />
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Detalle;