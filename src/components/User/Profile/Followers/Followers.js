import React, { useState, useEffect } from 'react';
import { size } from 'lodash';
import { useQuery } from '@apollo/client';
import { GET_FOLLOWERS, GET_FOLLOWEDS } from '../../../../gql/follow';
import ModalBasic from '../../../Modal/ModalBasic/ModalBasic';
import ListUsers from '../../ListUsers/ListUsers';
import './Followers.scss';

export default function Followers(props) {

    const {username} = props;

    // useState del Modal
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("");
    const [childrenModal, setChildrenModal] = useState(null);

    const {
        data: dataFollowers, 
        loading: loadingFollowers,
        startPolling: startPollingFollowers,
        stopPolling: stopPollingFollowers,
    } = useQuery(GET_FOLLOWERS, {
        variables: { username },
    });

    const {
        data: dataFolloweds,
        loading: loadingFolloweds,
        startPolling: startPollingFolloweds,
        stopPolling: stopPollingFolloweds,
      } = useQuery(GET_FOLLOWEDS, {
        variables: { username },
      });

    // RealTime de Followers (seguidores se actualiza cada segundo)
    useEffect(() => {
        startPollingFollowers(1000);
        return () => {
            stopPollingFollowers();
        };
    }, [startPollingFollowers, stopPollingFollowers]);
    
    // RealTime de Followeds (seguidos se actualiza cada segundo)
    useEffect(() => {
        startPollingFolloweds(1000);
        return () => {
            stopPollingFolloweds();
        };
    }, [startPollingFolloweds, stopPollingFolloweds]);
    
    // Función para abrir el Modal con la lista de seguidores
    const openFollowers = () => {
        setTitleModal("Seguidores");
        setChildrenModal(
        <ListUsers users={getFollowers} setShowModal={setShowModal} />
        );
        setShowModal(true);
    }

     // Función para abrir el Modal con la lista de seguidos
     const openFolloweds = () => {
        setTitleModal("Usuarios Seguidos");
        setChildrenModal(
        <ListUsers users={getFolloweds} setShowModal={setShowModal} />
        );
        setShowModal(true);
    }

    if (loadingFollowers || loadingFolloweds) return null;
    const {getFollowers} = dataFollowers;
    const {getFolloweds} = dataFolloweds;



    return (
        <>
        <div className="followers">
            <p><span>**</span> publicaciones</p>
            <p className="link" onClick={openFollowers}>
                <span>{size(getFollowers)}</span> seguidores
            </p>
            <p className="link" onClick={openFolloweds}>
                <span>{size(getFolloweds)}</span> seguidos
                </p>
        </div>
        <ModalBasic show={showModal} setShow={setShowModal} title={titleModal}>
            {childrenModal}
        </ModalBasic>
        </>
    );
}
