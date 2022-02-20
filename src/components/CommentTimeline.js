import React, { useCallback, useState, useEffect }                        from 'react';
import { Button, Text, Textarea, Timeline, Divider, Collapse, Avatar }    from '@mantine/core';
import { BiComment, BiPaperPlane }                                        from 'react-icons/bi';
import useStore                                                           from '../useStore';
import useAlerts                                                          from "../useAlerts"
import axios                                                              from 'axios';
import qs                                                                 from "qs"

const CommentTimeline = ({id}) => {

  const user                    = useStore(store => store.user)
  const users                   = useStore(store => store.users)
  const [text, setText]         = useState("")
  const [comments, setComments] = useState([])
  const [opened, setOpen]       = useState(false);
  const alert                   = useAlerts()

  const loadComments = useCallback(async () => {
    const query = qs.stringify({
      populate: {0: "user"},
      sort: {createdAt: "DESC"},
      filters: {
          item: {
              id: id
      }}
    },{encodeValuesOnly: true})

    const response = (await axios.get(`/comments?${query}`).catch(err => {
      alert.error("Fehler beim laden der Kommentare", err)
    }))?.data?.data.map(data => data?.attributes)

    setComments(response ?? [])
  }, [id])

  const addComment = useCallback(async () => {
      await axios.post("/comments", {
            data: {
                text,
                user: user.id,
                item: id
            }
      }).catch(err => {
        alert.error("Fehler beim hinzufügen des Kommentars", err)
      })

      loadComments()
      setText("")
  },[text, user, loadComments, id])

  useEffect(() => {
    loadComments()
    console.log(id)
  }, [loadComments])

  return <section className='comments'>
        <Divider my="xs" label={<Button onClick={() => {setOpen(open => !open)}} variant="gradient" gradient={{ from: 'highlight', to: 'highlight2', deg: 60 }} leftIcon={<BiComment />} compact> Kommentare ({comments.length}) </Button>} labelPosition="center" />
        <Collapse className='comments' in={opened} >
            <section className='container second'>
              <div className='commentInput'>
                <Textarea placeholder="..." radius="xs" autosize minRows={3} color="white" onChange={e => setText(e.target.value)} value={text}
                    label="Kommentar hinzufügen"
                />
                <Button radius="xs" disabled={text.length === 0} onClick={addComment}><BiPaperPlane /></Button>
              </div>
              { comments.length === 0 ? <p> Keine Kommentare </p> : 
                <Timeline className='container second' bulletSize={38} lineWidth={3} active={comments.length} color="highlight">
                { comments.map(comment => <Timeline.Item 
                                key={comment?.text}
                                bullet={<Avatar size={36} radius="xl" src={process.env.REACT_APP_API_BASE + users?.find(user => user?.id === comment?.user?.data?.id)?.avatar?.formats?.small?.url}  />} 
                                title={`${comment?.user?.data.attributes?.forename} ${comment?.user?.data.attributes?.lastname}`} >
                          <Text size="sm" style={{ marginTop: 4 }}> {comment?.text} </Text> 
                      </Timeline.Item>
                )}
                </Timeline>
              }
            </section>
        </Collapse>
    </section>
};

export default CommentTimeline;
