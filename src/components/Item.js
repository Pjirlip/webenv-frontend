import { Button, Image, TextInput, Textarea, NumberInput, Switch, Chips, Chip, Avatar, Space }     from '@mantine/core';
import React, { useCallback, useEffect, useRef, useState }                                  from 'react';
import CommentTimeline                                                                      from './CommentTimeline';
import { BiEuro, BiPlusCircle }                                                             from 'react-icons/bi';
import useStore                                                                             from '../useStore';
import axios                                                                                from 'axios';
import useAlerts                                                                            from '../useAlerts';
import { useNavigate }                                                                      from 'react-router-dom';

const Item = ({id}) => {

    const [img, setImage]               = useState(null)
    const [title, setTitle]             = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice]             = useState(0)
    const [interested, setInterested]   = useState([])
    const [hasChanged, setHasChanged]   = useState(false)

    const [self, users]                 = useStore(store => [store.user, store.users])
    const fileinput                     = useRef()
    const alert                         = useAlerts()
    const navigate                      = useNavigate()

    useEffect(() => {
        if(!id)
            return

        const loadItem = async () => {
            const result = (await axios.get(`/items/${id}?populate=*`).catch(err => {
                console.error(err)
                alert.error("Fehler beim Laden des Gegenstands", err)
            }))?.data

            setDescription(result?.data?.attributes?.description)
            setTitle(result?.data?.attributes?.title)
            setPrice(result?.data?.attributes?.price)
            setInterested(result?.data?.attributes?.interested?.data?.map(person => person?.id) ?? [])
            setImage(result?.data?.attributes?.img?.data?.attributes)
        }

        loadItem()
    }, [id])

    const saveItem = useCallback(async () => {

        const response = await axios.request({
            url: id ? `/items/${id}` : "/items",
            method: id ? "put" : "post",
            data: {
                data: {
                    title,
                    img: img?.id,
                    description,
                    price,
                    interested,
                    upload_by: {data: self?.id}
                }
            }
        }).catch(err => {
            alert.error("Fehler beim anlegen des Gegenstands", err)
        })

        if(response?.status === 200)
        {
            alert.info(id ? "Gegenstand bearbeitet" : "Gegenstand angelegt", id ? `Gegenstand ${title} erfolgreich bearbeitet.` : `Gegenstand ${title} erfolgreich angelegt.`)
            setHasChanged(false)
            if(!id)
                navigate("/")
        }
    }, [alert, description, title, img, price, interested, self])

    const uploadImg = useCallback(async (event) => {
        const fileUploaded = event.target.files[0];
        const formData = new FormData()
        formData.append("files", fileUploaded)
        const response = (await axios.post("/upload", formData).catch(err => {
            console.error(err)
            alert.error("Fehler: Upload", "Es gab einen Fehler beim Bild-Upload. Prüfen Sie format und größe der Datei.")
        }))?.data
        
        setImage(response[0])
        setHasChanged(true)

    }, [alert])

    return <>
                <section className='singleItem container second'> 
                    <form>

                        <div className='compact'>
                                <div className='image' onClick={e => {fileinput.current.click()}}>
                                    <Image
                                        radius="sm"
                                        height={100}
                                        width={100}
                                        fit="contain"
                                        src={`${process.env.REACT_APP_API_BASE}${img?.formats?.medium?.url}`}
                                        withPlaceholder={!img}
                                    />
                                </div>

                                <input
                                    type="file"
                                    ref={fileinput}
                                    onChange={uploadImg}
                                    style={{display: 'none'}}
                                    accept="image/*"
                                />

                                <Chips className='interrested' multiple value={interested} variant="filled" onChange={data => {setHasChanged(true); setInterested(data)}} >
                                        { users.map(user => <Chip key={user?.id} value={user?.id} disabled={user?.id !== self?.id}>
                                            { user?.forename } <Avatar src={process.env.REACT_APP_API_BASE + user?.avatar?.formats?.small?.url} alt="" radius="xl" size={24} /> </Chip> )}
                                </Chips>

                        </div>

                        <TextInput
                            placeholder="Couch, Tisch, Kühlschrank..."
                            label="Bezeichner"
                            size="md"
                            required
                            value={title} 
                            onChange={(event) => {setHasChanged(true); setTitle(event.currentTarget.value)}}
                        />

                        <Textarea
                            placeholder="Rot, 2 Meter hoch"
                            label="Beschreibung"
                            size="md"
                            autosize
                            value={description}
                            onChange={(event) => {setHasChanged(true); setDescription(event.currentTarget.value)}}
                            minRows={4}
                            maxRows={4}
                        />

                        <NumberInput
                            hideControls
                            decimalSeparator=","
                            label="Schätzwert"
                            defaultValue={0}
                            precision={2}
                            min={0}
                            onChange={(val) => {setHasChanged(true); setPrice(val)}}
                            value={price}
                            icon={<BiEuro />}
                        />

                        { !id ? <Button color="highlight2" onClick={e => {e.preventDefault(); saveItem()}}> <BiPlusCircle /> <Space w="xs" /> Hinzufügen </Button> :<></>}
                        { id && hasChanged ? <Button color="highlight2" onClick={e => {e.preventDefault(); saveItem()}}> <BiPlusCircle /> <Space w="xs" /> Änderung übernehmen </Button> :<></>}
                    </form>
                </section>

                { id ? <CommentTimeline /> : <></>}
    </>
};

export default Item;
