import React from "react";
import { Button } from "semantic-ui-react";
import { useQuery, useMutation } from "@apollo/client";
import { IS_FOLLOW, FOLLOW, UN_FOLLOW } from "../../../../gql/follow";
import "./HeaderProfile.scss";

export default function HeaderProfile(props) {

    const { getUser, auth, handlerModal } = props;

    const [follow] = useMutation(FOLLOW);
    const [unFollow] = useMutation(UN_FOLLOW);

    const {data, loading, refetch } = useQuery(IS_FOLLOW, {
      variables: { username: getUser.username },
    });


    // Función del Botón de Seguir y dejar de seguir
    const buttonFollow = () => {
      if (data.isFollow) {
        return (
          <Button className="btn-danger" onClick={onUnFollow}>
            Dejar de seguir
          </Button>
        );
      } else {
        return (
          <Button className="btn-action" onClick={onFollow}>
            Seguir
          </Button>
        );
      }
    };

    // Función de seguir
    const onFollow = async () => {
      try {
        await follow({
          variables: {
            username: getUser.username,
          },
        });
        refetch();
      } catch (error) {
        console.log(error);
      }
    };

    // Función de dejar de seguir
    const onUnFollow = async () => {
      try {
        await unFollow({
          variables: {
            username: getUser.username,
          },
        });
        refetch();
      } catch (error) {
        console.log(error);
      }
    };



  return (
    <div className="header-profile">
      <h2>{getUser.username}</h2>

      {/* Si estoy en mi usuario muestra el boton ajustes, si estoy en otro usuario muestra el boton de seguir */}
      {getUser.username === auth.username ? (
        <Button onClick={() => handlerModal('settings')}>Ajustes</Button>
      ) : (
        !loading && buttonFollow()
      )}


    </div>
  );
}
