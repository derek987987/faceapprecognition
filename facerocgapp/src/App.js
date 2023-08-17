import React, {Component} from 'react';
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const particlesoptions = {
  background: {
      color: {
          value: "#0d47a1",
      },
  },
  fpsLimit: 120,
  interactivity: {
      events: {
          onClick: {
              enable: true,
              mode: "push",
          },
          onHover: {
              enable: true,
              mode: "repulse",
          },
          resize: true,
      },
      modes: {
          push: {
              quantity: 4,
          },
          repulse: {
              distance: 200,
              duration: 0.4,
          },
      },
  },
  particles: {
      color: {
          value: "#ffffff",
      },
      links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
      },
      collisions: {
          enable: true,
      },
      move: {
          direction: "none",
          enable: true,
          outModes: {
              default: "bounce",
          },
          random: false,
          speed: 3,
          straight: false,
      },
      number: {
          density: {
              enable: true,
              area: 800,
          },
          value: 80,
      },
      opacity: {
          value: 0.5,
      },
      shape: {
          type: "circle",
      },
      size: {
          value: { min: 1, max: 5 },
      },
  },
  detectRetina: true,
}

const initialState = {
    input:'',
    imageUrl:'',
    box:{},
    route:'signin',
    isSignedIn: false,
    user: {
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
    }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.particlesInit = this.particlesInit.bind(this);
    this.particlesLoaded = this.particlesLoaded.bind(this);
    this.state = {
        input:'',
        imageUrl:'',
        box:{},
        route:'signin',
        isSignedIn: false,
        user: {
            id:'',
            name:'',
            email:'',
            entries:0,
            joined:''
        }
    }
  }

  loadUser = (data)=>{
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (result) => {
    //console.log(result.outputs[0].data.regions[0].region_info.bounding_box);
    const clarifaiFace = result.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const height = Number(image.height);
    const width = Number(image.width);
    //console.log(width, height);
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    console.log("onButtonSubmit this.state.input", this.state.input);

    //console.log('click');
    this.setState({imageUrl: this.state.input})
        fetch('http://localhost:3000/imageurl', {
                method:'post',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    input: this.state.input
                })
            })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            fetch('http://localhost:3000/image', {
                method:'put',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id: this.state.user.id
                })
            })
            .then(response=>response.json())
            .then(count=>{
                this.setState(Object.assign(this.state.user, { entries: count[0].entries}));
            })
            .catch(console.log)
            //console.log(result.outputs[0].data.regions[0].region_info.bounding_box);
            this.displayFaceBox(this.calculateFaceLocation(result));
        })
        .catch(error => console.log('error', error));
  }

  async particlesInit(engine) {
    console.log(engine);
    await loadFull(engine);
  }

  async particlesLoaded(container) {
    console.log(container);
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
        this.setState(initialState)
    }else if(route === 'home'){
        this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles className='particles'
            id="tsparticles"
            init={this.particlesInit}
            loaded={this.particlesLoaded}
            options={particlesoptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        {route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageUrl = {imageUrl} /> 
        </div>
        :(
            route === 'signin'
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
      </div>
    );
  } 
}

export default App;