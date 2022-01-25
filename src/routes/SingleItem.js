import React            from 'react';
import Item             from '../components/Item';
import { useParams }    from 'react-router-dom';


const SingleItem = () => {

    const {itemID} = useParams()

    return <section className='wrapper singleItemView'>
        <h2> Gegenstand bearbeiten </h2>
        <Item id={itemID} />
    </section>;
};

export default SingleItem;
