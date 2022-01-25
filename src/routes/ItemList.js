import { Avatar, AvatarsGroup, Center, List, Pagination, Space, Table, TextInput }  from '@mantine/core';
import axios                                                                        from 'axios';
import React, { useCallback, useEffect, useState }                                  from 'react';
import { BiEuro, BiHappy, BiHappyHeartEyes, BiImage, BiPackage }                                                                   from 'react-icons/bi';
import useAlerts                                                                    from '../useAlerts';
import useStore                                                                     from '../useStore';
import qs                                                                           from "qs"
import { useNavigate }                                                              from 'react-router-dom';
import { isMobile } from 'react-device-detect';

const ItemList = () => {

    const [search, setSearch]       = useState("")
    const [items, setItems]         = useState([])
    const [allItems, setAllItems]   = useState([])
    const alert                     = useAlerts();
    const [pageSize, setPageSize]   = useState(25)
    const [page, setPage]           = useState(1)
    const [maxItems, setMaxItems]   = useState(1)
    const [maxPages, setMaxPages]   = useState(1)
    const [sort, setSort]           = useState("asc")
    const users                     = useStore(store => store.users)
    const navigate                  = useNavigate()

    const rows = items.map(item => 
            <tr key={item?.id} onClick={() => {
                navigate(`/list/${item?.id}`)
            }}>
                <td><Avatar size="md" radius="xl" src={process.env.REACT_APP_API_BASE + item?.attributes?.img?.data?.attributes?.formats?.thumbnail?.url} /></td>
                <td>{item?.attributes?.title}</td>
                <td>{item?.attributes?.price} <BiEuro /></td>
                <td><AvatarsGroup>
                        {item.attributes.interested?.data && item.attributes.interested?.data.length > 0 ?
                            item.attributes.interested?.data.map(person => 
                                {
                                    return <Avatar key={item?.title + person?.id} radius="xl" size="md" src={process.env.REACT_APP_API_BASE + users.find(userAttr => userAttr?.id === person?.id)?.avatar?.formats?.thumbnail?.url} />
                                }
                            )
                        : <></> }    
                    </AvatarsGroup>
                </td>
            </tr>
        )
    

    useEffect(() => {
        const loadItems = async () => {

            const query = qs.stringify({
                pagination: {withCount: true, pageSize: pageSize},
                populate: {0: "interested", 1:"img"},
                sort: {title: sort},
                filters: {
                    title: {
                        $containsi: search
                }}
            },{encodeValuesOnly: true})

            const result = (await axios.get(`/items?${query}`).catch(err => {
                console.error(err)
                alert.error("Fehler beim Laden der Gegenstände", err)
            }))?.data
    
            console.log(result)
    
            setItems(result?.data)
            setMaxItems(result?.meta?.pagination?.total)
        }

        loadItems()
    }, [page, pageSize, sort, search])

    const changeSort = () => {
        setSort(sort => sort === "asc" ? "desc" : "asc")
    }

    useEffect(() => {
        setMaxPages(Math.ceil(maxItems / pageSize))
    }, [maxItems, pageSize])

  return <section className='wrapper itemlist'>
    <h2> Übersicht </h2>
    <div className='container main'>
        <Center>
            <TextInput
                placeholder="Suche"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </Center>
        <Space h="lg" />
        <Table highlightOnHover>
            <thead>
                <tr>
                    <th><BiImage /></th>
                    <th><BiPackage /> {!isMobile ? "Gegenstand" : ""} </th>
                    <th><BiEuro /> {!isMobile ? "Schätzwert" : ""}</th>
                    <th><BiHappyHeartEyes /> {!isMobile ? "Interressierte" : ""}</th>
                </tr>
            </thead>
            <tbody>{rows}</tbody>
        </Table>
        <Space h="lg" />
        <Center>
            <Pagination page={page} onChange={setPage} total={maxPages} color="highlight2" size="lg"/>
        </Center>
    </div>
  </section>;
};

export default ItemList;
