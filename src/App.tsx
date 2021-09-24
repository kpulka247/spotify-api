import React, {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
import dotenv from "dotenv";
import * as qs from "qs";
import Dropdown from "./Dropdown";
import List from "./List";
import Details, {detailProps} from "./Details";
import Lyrics from "./Lyrics";
import {Col, Container, Row} from "react-bootstrap";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

dotenv.config()

const refreshToken = localStorage.getItem('refreshToken')

const spotify_client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID
const spotify_client_secret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET

const authRequest = axios.create({
  baseURL: 'https://accounts.spotify.com/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

const apiRequest = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  headers: {
    'Authorization': `Bearer ${refreshToken}`
  }
})

try {
  apiRequest.interceptors.response.use(function (res) {
    console.log('refreshToken', refreshToken)
    return res
  }, async function (e) {
    if (e.response) {
      if (e.response.status === 401) {
        try {
          authRequest.post('/token', qs.stringify({
            grant_type: 'client_credentials',
            client_id: spotify_client_id,
            client_secret: spotify_client_secret
          }), {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }).then(res => {
            console.log('accessToken', res.data.access_token)
            localStorage.setItem('accessToken', res.data.access_token)
          })
            .catch(e => {
              console.log('Error', e)
            })
        } catch (e) {
          console.log('Error', e)
        }
        const accessToken = localStorage.getItem('accessToken')
        console.log('TOKEN BEFORE REFRESH', refreshToken)
        if (accessToken != null) {
          localStorage.setItem('refreshToken', accessToken)
          console.log('TOKEN AFTER REFRESH', localStorage.getItem('refreshToken'))
        }
        return apiRequest
      } else {
        return Promise.reject(e.response.data)
      }
    }
    return Promise.reject(e)
  })
} catch (e) {
  console.log('Error', e)
}

export interface playlistProps {
  id: string,
  description: string
}

const App = () => {

  const [playlistList, setPlaylistList] = useState<playlistProps | []>([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>()
  const [tracks, setTracks] = useState({selectedTrack: '', listOfTracksFromAPI: []})
  const [trackDetail, setTrackDetail] = useState<detailProps | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {

    try {
      apiRequest.get('/browse/featured-playlists', {}).then(res => {
        console.log(res)
        setPlaylistList(res.data.playlists.items);

        if (res.data.playlists.items.length) {
          setSelectedPlaylistId(res.data.playlists.items[0].id)
        }
      })
        .catch(e => {
          console.log('Error', e)
        })
    } catch (e) {
      console.log('Error', e)
    }

    setIsLoading(true)
  }, [])

  useEffect(() => {

    apiSearch()
  }, [selectedPlaylistId])

  const playlistChanged = (val: string) => {
    setSelectedPlaylistId(val)
  }

  const apiSearch = () => {
    if (!selectedPlaylistId) {
      return
    }

    try {
      apiRequest.get(`/playlists/${selectedPlaylistId}/tracks`, {
        params: {
          limit: 20
        }
      }).then(res => {
        setTracks({
          selectedTrack: tracks.selectedTrack,
          listOfTracksFromAPI: res.data.items
        })
        console.log('apiRequest', res)
      })
        .catch(e => {
          console.log('Error', e)
        })
    } catch (e) {
      console.log('Error', e)
    }
  }

  return isLoading ? (
    <Container fluid className="justify-content-center">
      <Row className="m-4">
        <Col>
          <Dropdown options={playlistList} selectedValue={selectedPlaylistId} changed={playlistChanged}/>
        </Col>
      </Row>
      <Row className="m-4">
        <Col>
          <List items={tracks.listOfTracksFromAPI} clicked={track => setTrackDetail({track: track})}/>
        </Col>
        <Col>
          {trackDetail && <Lyrics {...trackDetail}/>}
        </Col>
        <Col>
          {trackDetail && <Details {...trackDetail}/>}
        </Col>
      </Row>
    </Container>
  ) : <Container className="justify-content-center">Loading...</Container>
}

export default App
