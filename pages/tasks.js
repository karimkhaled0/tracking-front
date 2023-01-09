import React, { useEffect, useState } from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import CreateTask from '../components/CreateTask'
import Header from '../components/Header'
import ViewTask from '../components/ViewTask'
import GetTasks from '../components/GetTasks'
function Tasks() {
  const router = useRouter()
  const [categoryRes, setCategoryRes] = useState([])
  const [taskRes, setTaskRes] = useState([])
  const [progress, setProgress] = useState(true)
  const [review, setReview] = useState(false)
  const [finished, setFinished] = useState(false)
  const [user, setUser] = useState(false)
  const loggedHandler = useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((r) => r.json())
    const error = res.error
    if (error == 'Not Authorized') {
      localStorage.removeItem('token')
      router.push({
        pathname: '/signin',
      })
    } else {
      setUser(true)
    }
  }, [])
  // date formatter

  const toggleProgress = () => {
    setProgress(true)
    setReview(false)
    setFinished(false)
  }
  const toggleReview = () => {
    setProgress(false)
    setReview(true)
    setFinished(false)
  }
  const toggleFinished = () => {
    setProgress(false)
    setReview(false)
    setFinished(true)
  }

  // sign in router if user not logged in
  const signin = () => {
    router.push({
      pathname: '/signin',
    })
  }
  // get category
  useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/category', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((t) => t.json())
      .catch((e) => console.log(e))
    setCategoryRes(res.categories)
  }, [])
  // get tasks
  useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/task', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((t) => t.json())
      .catch((e) => console.log(e))
    setTaskRes(res.tasks)
  }, [])
  // fetch user data
  const [teamLeader, setTeamLeader] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [teamLeaderCategory, setTeamLeaderCategory] = useState([])

  const profile = useEffect(async () => {
    const res = await fetch('https://tracking-back.onrender.com/api/user/me', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    })
      .then((r) => r.json())
      .catch((e) => console.log(e))
    if (res.data?.isTeamLeader) {
      setTeamLeader(true)
      setTeamLeaderCategory(res.data.category)
    }
    if (res.data?.isAdmin) {
      setAdmin(true)
    }
  }, [])

  return (
    <div className="relative">
      <Header headerView={true} islogged={user} />
      {user ? (
        // if the user is logged in
        <section className="max-w-10xl mx-auto px-8">
          {/* Search and Create task button */}
          <div className="my-10 flex items-center justify-between">
            <div className="flex items-center rounded-full border-2 border-blue-200 py-1 shadow-sm">
              <input
                className=" w-72 bg-transparent pl-5 text-sm text-gray-600 placeholder-gray-400  outline-none"
                type="text"
                placeholder={'Start your search'}
              />
              <SearchIcon className="mx-3 flex h-8 cursor-pointer rounded-full bg-blue-400 p-2 text-white" />
            </div>
            <CreateTask />
          </div>
          {/* Sections of the tasks */}
          <div className="relative flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                className={
                  progress
                    ? 'border-b border-blue-500 pb-1 text-lg font-semibold text-blue-700'
                    : 'text-gray-500'
                }
                onClick={toggleProgress}
              >
                In progress
              </button>
              <button
                className={
                  review
                    ? 'border-b border-blue-500 pb-1 text-lg font-semibold text-blue-700'
                    : 'text-gray-500'
                }
                onClick={toggleReview}
              >
                Review
              </button>
              <button
                className={
                  finished
                    ? 'border-b border-blue-500 pb-1 text-lg font-semibold text-blue-700'
                    : 'text-gray-500'
                }
                onClick={toggleFinished}
              >
                Finished
              </button>
            </div>
          </div>
          {/* in progress template */}
          {progress ? (
            <div className="grid grid-cols-3 gap-x-10">
              {admin
                ? categoryRes?.map((item) => {
                    return item.tasks?.map((i) => {
                      if (i.inProgress) {
                        return (
                          <GetTasks
                            category={item.name}
                            key={i._id}
                            customerName={i.customerName}
                            location={i.location.split(',')[0]}
                            description={i.description}
                            endDate={format(
                              parseISO(i.endDate.split('T')[0]),
                              'dd/MMMM/yyyy'
                            )}
                            technical={taskRes?.map((ii) => {
                              if (
                                (i.techId == ii.techId?._id || true) &&
                                i._id == ii._id
                              ) {
                                return ii.techId?.name
                                  ? ii.techId.name
                                  : 'Removed User'
                              } else {
                                return
                              }
                            })}
                            started={i.started ? 'Task started' : null}
                            ViewTask={
                              <ViewTask
                                description={i.description}
                                customerName={i.customerName}
                                phoneNumber={i.customerPhonenumber}
                                address={i.location.split(',')[0]}
                                endDate={i.endDate}
                                category={item.name}
                                taskId={i._id}
                                status={'In progress'}
                                progress={i.inProgress}
                                review={i.inReview}
                                finished={i.finished}
                                tech={taskRes?.map((ii) => {
                                  if (
                                    (i.techId == ii.techId?._id || true) &&
                                    i._id == ii._id
                                  ) {
                                    return ii.techId?.name
                                      ? ii.techId.name
                                      : 'Removed User'
                                  } else {
                                    return
                                  }
                                })}
                              />
                            }
                          />
                        )
                      }
                    })
                  })
                : categoryRes?.map((item) => {
                    if (item._id == teamLeaderCategory) {
                      return item.tasks?.map((i) => {
                        if (i.inProgress) {
                          return (
                            <GetTasks
                              category={item.name}
                              key={i._id}
                              customerName={i.customerName}
                              location={i.location.split(',')[0]}
                              description={i.description}
                              endDate={format(
                                parseISO(i.endDate.split('T')[0]),
                                'dd/MMMM/yyyy'
                              )}
                              technical={taskRes?.map((ii) => {
                                if (
                                  (i.techId == ii.techId?._id || true) &&
                                  i._id == ii._id
                                ) {
                                  return ii.techId?.name
                                    ? ii.techId.name
                                    : 'Removed User'
                                } else {
                                  return
                                }
                              })}
                              started={i.started ? 'Task started' : null}
                              ViewTask={
                                <ViewTask
                                  description={i.description}
                                  customerName={i.customerName}
                                  phoneNumber={i.customerPhonenumber}
                                  address={i.location.split(',')[0]}
                                  endDate={i.endDate}
                                  category={item.name}
                                  taskId={i._id}
                                  status={'In progress'}
                                  progress={i.inProgress}
                                  review={i.inReview}
                                  finished={i.finished}
                                  tech={taskRes?.map((ii) => {
                                    if (
                                      (i.techId == ii.techId?._id || true) &&
                                      i._id == ii._id
                                    ) {
                                      return ii.techId?.name
                                        ? ii.techId.name
                                        : 'Removed User'
                                    } else {
                                      return
                                    }
                                  })}
                                />
                              }
                            />
                          )
                        }
                      })
                    }
                  })}
            </div>
          ) : null}
          {review ? (
            <div className="grid grid-cols-3 gap-x-10">
              {admin
                ? categoryRes?.map((item) => {
                    return item.tasks?.map((i) => {
                      if (i.inReview) {
                        return (
                          <GetTasks
                            category={item.name}
                            key={i._id}
                            customerName={i.customerName}
                            location={i.location.split(',')[0]}
                            description={i.description}
                            endDate={format(
                              parseISO(i.endDate.split('T')[0]),
                              'dd/MMMM/yyyy'
                            )}
                            technical={taskRes?.map((ii) => {
                              if (
                                (i.techId == ii.techId?._id || true) &&
                                i._id == ii._id
                              ) {
                                return ii.techId?.name
                                  ? ii.techId.name
                                  : 'Removed User'
                              } else {
                                return
                              }
                            })}
                            ViewTask={
                              <ViewTask
                                description={i.description}
                                customerName={i.customerName}
                                phoneNumber={i.customerPhonenumber}
                                address={i.location.split(',')[0]}
                                endDate={i.endDate}
                                category={item.name}
                                taskId={i._id}
                                status={'In review'}
                                progress={i.inProgress}
                                review={i.inReview}
                                finished={i.finished}
                                report={i.report}
                                tech={taskRes?.map((ii) => {
                                  if (
                                    (i.techId == ii.techId?._id || true) &&
                                    i._id == ii._id
                                  ) {
                                    return ii.techId?.name
                                      ? ii.techId.name
                                      : 'Removed User'
                                  } else {
                                    return
                                  }
                                })}
                              />
                            }
                          />
                        )
                      }
                    })
                  })
                : categoryRes?.map((item) => {
                    if (item._id == teamLeaderCategory) {
                      return item.tasks?.map((i) => {
                        if (i.inReview) {
                          return (
                            <GetTasks
                              category={item.name}
                              key={i._id}
                              customerName={i.customerName}
                              location={i.location.split(',')[0]}
                              description={i.description}
                              endDate={format(
                                parseISO(i.endDate.split('T')[0]),
                                'dd/MMMM/yyyy'
                              )}
                              technical={taskRes?.map((ii) => {
                                if (
                                  (i.techId == ii.techId?._id || true) &&
                                  i._id == ii._id
                                ) {
                                  return ii.techId?.name
                                    ? ii.techId.name
                                    : 'Removed User'
                                } else {
                                  return
                                }
                              })}
                              ViewTask={
                                <ViewTask
                                  description={i.description}
                                  customerName={i.customerName}
                                  phoneNumber={i.customerPhonenumber}
                                  address={i.location.split(',')[0]}
                                  endDate={i.endDate}
                                  category={item.name}
                                  taskId={i._id}
                                  status={'In review'}
                                  progress={i.inProgress}
                                  review={i.inReview}
                                  finished={i.finished}
                                  report={i.report}
                                  tech={taskRes?.map((ii) => {
                                    if (
                                      (i.techId == ii.techId?._id || true) &&
                                      i._id == ii._id
                                    ) {
                                      return ii.techId?.name
                                        ? ii.techId.name
                                        : 'Removed User'
                                    } else {
                                      return
                                    }
                                  })}
                                />
                              }
                            />
                          )
                        }
                      })
                    }
                  })}
            </div>
          ) : null}
          {finished ? (
            <div className="grid grid-cols-3 gap-x-10">
              {admin
                ? categoryRes?.map((item) => {
                    return item.tasks?.map((i) => {
                      if (i.finished) {
                        return (
                          <GetTasks
                            category={item.name}
                            key={i._id}
                            customerName={i.customerName}
                            location={i.location.split(',')[0]}
                            description={i.description}
                            endDate={format(
                              parseISO(i.endDate.split('T')[0]),
                              'dd/MMMM/yyyy'
                            )}
                            technical={taskRes?.map((ii) => {
                              if (
                                (i.techId == ii.techId?._id || true) &&
                                i._id == ii._id
                              ) {
                                return ii.techId?.name
                                  ? ii.techId.name
                                  : 'Removed User'
                              } else {
                                return
                              }
                            })}
                            ViewTask={
                              <ViewTask
                                description={i.description}
                                customerName={i.customerName}
                                phoneNumber={i.customerPhonenumber}
                                address={i.location.split(',')[0]}
                                endDate={i.endDate}
                                category={item.name}
                                taskId={i._id}
                                status={'Completed'}
                                progress={i.inProgress}
                                review={i.inReview}
                                finished={i.finished}
                                report={i.report}
                                tech={taskRes?.map((ii) => {
                                  if (
                                    (i.techId == ii.techId?._id || true) &&
                                    i._id == ii._id
                                  ) {
                                    return ii.techId?.name
                                      ? ii.techId.name
                                      : 'Removed User'
                                  } else {
                                    return
                                  }
                                })}
                              />
                            }
                          />
                        )
                      }
                    })
                  })
                : categoryRes?.map((item) => {
                    if (item._id == teamLeaderCategory) {
                      return item.tasks?.map((i) => {
                        if (i.finished) {
                          return (
                            <GetTasks
                              category={item.name}
                              key={i._id}
                              customerName={i.customerName}
                              location={i.location.split(',')[0]}
                              description={i.description}
                              endDate={format(
                                parseISO(i.endDate.split('T')[0]),
                                'dd/MMMM/yyyy'
                              )}
                              technical={taskRes?.map((ii) => {
                                if (
                                  (i.techId == ii.techId?._id || true) &&
                                  i._id == ii._id
                                ) {
                                  return ii.techId?.name
                                    ? ii.techId.name
                                    : 'Removed User'
                                } else {
                                  return
                                }
                              })}
                              ViewTask={
                                <ViewTask
                                  description={i.description}
                                  customerName={i.customerName}
                                  phoneNumber={i.customerPhonenumber}
                                  address={i.location.split(',')[0]}
                                  endDate={i.endDate}
                                  category={item.name}
                                  taskId={i._id}
                                  status={'Completed'}
                                  progress={i.inProgress}
                                  review={i.inReview}
                                  finished={i.finished}
                                  report={i.report}
                                  tech={taskRes?.map((ii) => {
                                    if (
                                      (i.techId == ii.techId?._id || true) &&
                                      i._id == ii._id
                                    ) {
                                      return ii.techId?.name
                                        ? ii.techId.name
                                        : 'Removed User'
                                    } else {
                                      return
                                    }
                                  })}
                                />
                              }
                            />
                          )
                        }
                      })
                    }
                  })}
            </div>
          ) : null}
        </section>
      ) : // If the user is not logged in
      null}
    </div>
  )
}

export default Tasks
