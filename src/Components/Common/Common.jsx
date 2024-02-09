export const DynamicDesignComponent = ({
    length,
    name,
    watch,
    setValue,
    register,
    getValues,
    errors,
    roleuserList,
    userRoleData,
    setUserDisable,
    userDisable
}) => {

    const array = Array.from({ length }, (_, index) => index + 1);
    const handleSelectChange = (index, selectedValue) => {
        setValue(`${name}_${index}`, selectedValue);
        const data = userDisable?.[`${name}`]
        if (data) {
            setUserDisable({
                ...userDisable,
                [`${name}`]: [...data, Number(selectedValue)]
            })
        } else {
            setUserDisable({
                ...userDisable,
                [`${name}`]: [Number(selectedValue)]
            })
        }
        // const updatedDisable = name === 'Screen' ? [...screenDisable] :
        //     name === 'Schdeule' ? [...scheduleDisable] :
        //         [...appDisable];
        // updatedDisable[index - 1] = selectedValue;
        // if (name === 'Screen') setScreenDisable(updatedDisable);
        // else if (name === 'Schdeule') setScheduleDisable(updatedDisable);
        // else if (name === 'App') setAppDisable(updatedDisable);
    };

    return (
        <tr>
            <td className="flex items-center text-center">
                {array.map((item, index) => {
                    let disableList = userRoleData?.[`${name}_Approve`];
                    console.log('disableList', disableList)
                    return (
                        <div key={item} className='flex flex-col gap-1'>
                            <select
                                className="ml-2 border border-primary rounded-lg px-2 py-1 lg:w-48 md:w-48 sm:w-32 cursor-pointer"
                                {...register(`${name}_${index + 1}`, { required: `This Field is required` })}
                                onChange={(e) => handleSelectChange(index + 1, e.target.value)}
                                disabled={disableList}
                                value={getValues(`${name}_${index + 1}`)}
                            >
                                <option value="" label="Select User Role"></option>
                                {roleuserList?.map((item, index) => (
                                    <option
                                        key={index}
                                        disabled={userDisable?.[`${name}`]?.includes(item?.value)}
                                        value={item?.value}
                                    >
                                        {item?.text}
                                    </option>
                                ))}
                            </select>
                            {errors?.[`${name}_${index + 1}`] && (
                                <span className="error">{errors?.[`${name}_${index + 1}`].message}</span>
                            )}
                        </div>

                    )
                })}
            </td>
        </tr >
    );
};

export function mapModuleTitlesToUserAccess(moduleTitle, watch) {
    const UserAccess = [];

    moduleTitle?.map((item) => {
        let View = watch(`${item?.alt}_View`);
        let Save = watch(`${item?.alt}_Edit`);
        let Delete = watch(`${item?.alt}_Delete`);
        let Approve = watch(`${item?.alt}_Approve`);
        let LevelApprove = watch(`${item?.alt}_LevelApprove`);
        let Total_Approve = LevelApprove ? Number(LevelApprove) : 0;
        const array = Array.from({ length: Total_Approve }, (_, index) => index + 1);
        let List_Approve = [];

        if (array?.length > 0) {
            array?.map((item1, index) => {
                let User_ID = watch(`${item?.alt}_${index + 1}`);
                let obj1 = {
                    "appoverId": 0,
                    "userId": Number(User_ID),
                    "levelNo": item1
                };
                List_Approve?.push(obj1);
            });
        }

        let obj = {
            "moduleID": item?.moduleID,
            "isView": View,
            "isSave": Save,
            "isDelete": Delete,
            "isApprove": Approve ? Approve : false,
            "noofApproval": Total_Approve,
            "listApproverDetails": List_Approve
        };

        UserAccess?.push(obj);
    });

    return UserAccess;
}

export function combineUserroleObjects(selectedRole) {
    let arr = [];

    selectedRole?.useraccess?.forEach((item) => {
        let obj1 = {
            [`${item?.name}_View`]: item?.isView,
            [`${item?.name}_Edit`]: item?.isSave,
            [`${item?.name}_Delete`]: item?.isDelete,
            [`${item?.name}_Approve`]: item?.isApprove,
            [`${item?.name}_LevelApprove`]: item?.noofApproval,
        };
        arr.push(obj1);
        if (item?.listApproverDetails?.length > 0) {
            item?.listApproverDetails?.map((user, index) => {
                let userObj = {
                    [`${item?.name}_${index + 1}`]: user?.userId,
                }
                arr?.push(userObj);
            })
        }
    });

    let obj = {
        "userRole": selectedRole?.orgUserRole,
        "orgUserRoleID": selectedRole?.orgUserRoleID,
    };
    let mergedObject = {};
    arr.forEach(obj => {
        mergedObject = { ...mergedObject, ...obj };
    });
    let combinedObj = { ...mergedObject, ...obj };
    return combinedObj;
}