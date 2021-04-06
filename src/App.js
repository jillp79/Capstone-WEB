import './App.css';
import React, {useEffect, useState} from "react";
import {Switch, Space , Form, Checkbox, Input, Button, List, Collapse, Breadcrumb , Modal} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { DeleteTwoTone } from '@ant-design/icons';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const style = { padding: '8px 0' };



function App() {

  let apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

   const [update,setUpdate] = useState(false);
//#region State Variables
    // Catagory variables
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
    // Question Variables
  const [questions, setQuestions] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [questionTxt, setQuestionTxt] = useState('');
   // Answer Variables
   const [answerTxt, setAnswerTxt] = useState('');

//#endregion

//#region Login / Registration State Variables
  const [loginVisible,setLoginModalVisible] = useState(false);
  const [regVisible,setRegModalVisible] = useState(false);
  const [loggedInUser, setLoggedinUser] = useState(); 
//#endregion

//#region UseEffect Functions
  useEffect(() => {
    // this code will run only once on component mount
    fetchCategories()
  }, [])

    useEffect(() => {
        // this code is going to run whenever the selectedCategory changes
    }, [selectedCategory])

    useEffect(() => {
        // this code is going to run whenever the loggedInUser changes
    }, [loggedInUser])

    useEffect(() => {
        // this code is going to run whenever the selectedQuestion changes
    }, [selectedQuestion])

    useEffect(() => {
        // this code is going to run whenever the selectedQuestion changes
    }, [update])



//#endregion

 //#region Login and Registration modal show/hide Funtions
    const showLoginModal=() => {
        setLoginModalVisible(true);
    }
    const showRegModal=() => {
        setRegModalVisible(true);
    }
    const handleLoginOk = () => {
        setTimeout(() => {
            setLoginModalVisible(false);
        }, 100);
      };
      const handleLoginCancel = () => {
         setLoginModalVisible(false);
      };
      const handleRegOk = () => {
        setTimeout(() => {
            setRegModalVisible(false);
        }, 100);
      };
      const handleRegCancel = () => {
         setRegModalVisible(false);
      };
//#endregion

//#region Registration Funtions
      //creates new user
      const onFinishReg = (values) => {
        console.log('Received values of form: ', values);
        if(values.agreement)
        {
           let newUser = JSON.stringify({username:values.username,password:values.password});
            createNewUser(newUser);
            handleRegOk();
        }
      };
      const createNewUser = async (newUser) => {
        let res = await fetch(`${apiUrl}/users/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        });
        let resData = res.json();
        console.log(resData);
    };
//#endregion

//#region Login Funtions
    const login = async (currentUser) => {
        let res = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentUser)
        }).then( );
        res.json().then(data => {
            setLoggedinUser(data.username)
            console.log(data);
            console.log(loggedInUser);
            handleLoginOk();
        });
    };

//#endregion

//#region Category Functions
const fetchCategories = async () => {
    console.log('this will fetch the categories');

    // let res = await fetch('http://localhost:3000/api/v1/categories');
    //   https://jill-capstone-api.herokuapp.com
    //   console.log(process.env.API_URL)
    //   console.log(process.env.REACT_APP_API_URL)
    console.log(`${apiUrl}/api/v1/categories`)
    let res = await fetch(`${apiUrl}/api/v1/categories`);
    let data = await res.json();
    console.log(data);
    setCategories(data);
  };

  //#endregion

//#region Question Functions
    const fetchQuestionsForCategory = async (id) => {
        console.log('fetch questions for this category id', id);
        let res = await fetch(`${apiUrl}/api/v1/categories/${id}/questions`);
        let data = await res.json();
        console.log(data);
        // get answers for questions
        data.forEach(question => {
            let answers =  fetchAnswersForQuestion(id,question.id);
          question.Answers.push(answers);
        });
        setQuestions(data);
    };

  const createNewQuestion = async () => {
      console.log('create a question for the category id', selectedCategory)
      let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({questionTxt: questionTxt})
      });
      fetchQuestionsForCategory(selectedCategory);
      setQuestionTxt('')
      updateRend();
  };

  const removeQuestion= async (questionId) => {
    const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${questionId}`, {
        method: 'DELETE',
      })
      updateRend();
  };

//#endregion

//#region Answer Functions

const fetchAnswersForQuestion = async (catagoryId,questionId) => {
    console.log('fetch answers for this question id', questionId);
    let res = await fetch(`${apiUrl}/api/v1/categories/${catagoryId}/questions/${questionId}/answers`);
    let data = await res.json();
    console.log(data);
    return data;
};


  const createANewAnswer = async () => {

    console.log('create a answer for the question id', selectedQuestion)
    let res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({answerTxt: answerTxt , username : loggedInUser})
    });
    fetchAnswersForQuestion(selectedCategory,selectedQuestion);
    setAnswerTxt('')
    updateRend();
  };

  const removeAnswer = async (answerId) => {
    const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers/${answerId}`, {
        method: 'DELETE',
      })
      updateRend();
};

const onCorrectAnswer = async (checked,answerId) =>{
    const res = await fetch(`${apiUrl}/api/v1/categories/${selectedCategory}/questions/${selectedQuestion}/answers/${answerId}/${checked}`, {
        method: 'PUT',
      })
      updateRend();
};

const handleChange= id => (evt) => {
    onCorrectAnswer(evt,id);
  }

const updateRend = () => {
    fetchQuestionsForCategory(selectedCategory);   
}

//#endregion

//#region Render Code
  return (
    <>
{/* Region Login / Registration */}
      <div className="grid grid-cols-12">
        <div className={'col-span-full border p-5'}>
          <h1 className={'text-center text-3xl'}>Questions App</h1>
        </div>
        <Button type="primary" onClick={showLoginModal}>
          Login
        </Button>
        <Modal
          visible={loginVisible}
          title="Login"
          onOk={handleLoginOk}
          onCancel={handleLoginCancel}
          footer={null}
        >
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={login}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                <Space direction="vertical">
                    <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Space>
                </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                        </Button>
                </Form.Item>
            </Form>
        </Modal>
        &nbsp;
        <Button type="primary" onClick={showRegModal}>
          Register
        </Button>
        <Modal
          visible={regVisible}
          title="Register"
          onOk={handleRegOk}
          onCancel={handleRegCancel}
          footer={null}
        >
            <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinishReg}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                <Space direction="vertical">
                    <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    placeholder="Password"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </Space>
                </Form.Item>
                <Form.Item>
                    <Form.Item name="agreement" valuePropName="checked" noStyle>
                    <Checkbox>I agree to the Terms and Conditions and Privacy Policy</Checkbox>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Register
                        </Button>
                </Form.Item>
            </Form>
        </Modal>
        {loggedInUser && <div  style={{ display: 'flex', justifyContent:'flex-end'} }> Welcome , {loggedInUser} </div>}
      </div>
{/* END Region Login / Registration*/}
      <div className="grid grid-cols-12">
{/* Region Catagory */}
        <div className={'col-span-full md:col-span-3 lg:col-span-2 border p-5'}>
            <List
                size="large"
                header={<div className={'font-bold'}>Categories List</div>}
                // footer={<div>Footer</div>}
                bordered
                dataSource={categories}
                renderItem={category => <List.Item>
                    <div className={category.id === selectedCategory ? 'cursor-pointer text-blue-500 font-bold' : 'cursor-pointer'} onClick={() => {
                        setSelectedCategory(category.id);
                        fetchQuestionsForCategory(category.id)
                        setAnswerTxt(''); //clears the answer if a dirrent catagory gets selected 
                    }}>
                        {category.name}
                    </div>
                </List.Item>}
            />
        </div>
{/* END Region Catagory */}       
{/* Region Question */}
        <div className={'col-span-full md:col-span-9 lg:col-span-10 border p-5'}>
            {selectedCategory && <div>
                <input value={questionTxt} onChange={(ev) => {
                    setQuestionTxt(ev.currentTarget.value);
                }} type="text" className={'border p-1 mr-5 w-2/3'}/>
                <Button type={'primary'} onClick={createNewQuestion}>Create new question</Button>
                <br/>
                <br/>
            </div>}
{/* Displays Question Accordion */}
{selectedCategory && <Collapse accordion>
    {questions && questions.map((question, index) => {
        // this is the question label 
        return <Panel   header={question.questionTxt} key={index} > 
                        <List
                        size="small"
                        footer={
                                // answer input
                                    <div>
                                        <input value={answerTxt} onChange={(ev) => {
                                            setSelectedQuestion(question.id);
                                            setAnswerTxt(ev.currentTarget.value);
                                        }} type="text" className={'border p-1 mr-5 w-2/3'}/>
                                        <Button type={'primary'} onClick={createANewAnswer}>Add Answer</Button>
                                    </div>
                                }
                        bordered
                        dataSource={question.Answers}
                        renderItem={answer =>                            
                                        <List.Item>
                                            {answer.id && 
                                            <div className="space-align-container">
                                                <div className="space-align-block">
                                                <Space align="center">
                                                <label>Correct Answer ?</label>
                                                    <Switch
                                                        checked={answer.correctAnswer}
                                                        size="small"
                                                        checkedChildren={<CheckOutlined />}
                                                        unCheckedChildren={<CloseOutlined />} 
                                                        onChange={handleChange(answer.id)}                                                    
                                                    />
                                                </Space>
                                                </div>
                                                <div className="space-align-block">
                                                <Space align="center">
                                                    {answer.answerTxt}
                                                </Space>
                                                </div>
                                                {answer.username &&
                                                    <div className="space-align-block">
                                                    <Space align="center">
                                                        By : {answer.username}
                                                    </Space>
                                                    </div>
                                                }
                                                <div className="space-align-block">
                                                <Space align="center">
                                                    <DeleteTwoTone twoToneColor="#ff1919" onClick={() => removeAnswer(answer.id)}/>
                                                </Space>
                                                </div>
                                            </div>
                                            }
                                        </List.Item>
                                    }
                        />
                        <div>Remove Question ? </div>&nbsp;<DeleteTwoTone twoToneColor="#ff1919" onClick={() => removeQuestion(question.id)}/>
            </Panel>
            
    })}
</Collapse>}
{/* Region Starting Question*/}
            {!selectedCategory && <h1 className={'text-center text-xl uppercase tracking-wider text-blue-500'}>Select a category to get started</h1>}
{/* EndRegion Starting Question*/}
        </div>

      </div>

      </>
  );
}

//#endregion

export default App;
