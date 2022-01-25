import React, { useCallback, useState }                                   from 'react';
import { Button, Text, Textarea, Timeline, Divider, Collapse, Avatar }    from '@mantine/core';
import { BiComment, BiPaperPlane }                                        from 'react-icons/bi';
import useStore                                                           from '../useStore';


const CommentTimeline = ({id}) => {

  const user                    = useStore(store => store.user)
  const [text, setText]         = useState("")
  const [comments, setComments] = useState([])
  const [opened, setOpen]       = useState(false);

  const addComment = useCallback(() => {
      setComments(comments => [...comments, {
        user,
        text
      }])
      setText("")
  },[text, user, setComments])

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
                { comments.map(comment => <Timeline.Item key={comment?.text} bullet={<Avatar size={36} radius="xl" src={process.env.REACT_APP_API_BASE + user?.avatar?.formats?.large?.url} alt="" />} title={`${comment?.user.forename}${comment?.user?.lastname}`} >
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
