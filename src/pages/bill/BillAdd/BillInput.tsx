import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import KDatePicker from "../../../components/KDatePicker";
import { calcStr } from "../../../helpers/data.helper";

export interface BillInputProps {
    onConfirm?: (v: {
        actionTime: Date;
        amount: number;
        remarks?: string;
    }) => void;
}

const keyMap = `789d
456+
123-
.0<=`.split('\n').map(l => l.split(''));

const keyDomMap: Record<string, ReactNode> = {
    '=': <div>完成</div>,
    '<': <div>{'🔙'}</div>
};

const DateBtn = styled.div`
    &,
    .k-popover,
    .k-popover-btn {
        width: 100%;
        height: 100%;
    }
`;

const BillInput: React.FC<BillInputProps> = (props) => {
    const [actionTime, setActionTime] = useState(new Date());
    const [remarks, setRemarks] = useState('');
    const [amountInput, setAmoutInput] = useState('');
    const handleKeyDown = (key: string) => {
        const last = amountInput.split(/[+-]/g).pop();
        if (/\d/.test(key)) {
            if (!last || last.length <= 11) {
                if (!last || !/\.\d{2,}/g.test(last)) {
                    setAmoutInput(amountInput + key);
                }
            }
        } else if (key === '<') {
            setAmoutInput(amountInput.slice(0, -1));
        } else if (/[=+-]/.test(key)) {
            const input = calcStr(amountInput).toString();
            console.log(amountInput, input);
            if (key !== '=') {
                setAmoutInput(input + key);
            } else {
                setAmoutInput(input);
                props.onConfirm?.({
                    actionTime,
                    amount: calcStr(amountInput),
                    remarks,
                });
            }
        } else if (key === '.') {
            if (!last) {
                setAmoutInput(amountInput + '0.');
            } else if (/\./g.test(last)) { } else {
                setAmoutInput(amountInput + '.');
            }
        } else {
            // setAmoutInput(amountInput + key);
        }
    }

    return <div className="flex flex-col h-96 px-2 py-2 md:px-8 md:py-4 bg-orange-200 border-t-2 border-gray-800">
        <div className="flex-1 flex">
            <div className="flex-1 flex px-2 md:px-4 py-2">
                <div className="flex justify-center items-center w-16 h-16 mr-4 rounded-full border-2 border-gray-800 bg-white cursor-pointer">
                    <div className="relative w-8 h-8 rounded-md border border-gray-600 bg-gray-400">
                        <div className="absolute right-0 top-2 w-4 h-3 border border-r-0 border-gray-600 rounded rounded-r-none bg-white">
                            <div className="relative -top-3 leading-2 select-none">.</div>
                        </div>
                    </div>
                </div>
                <div className="relative flex-1">
                    <div className="flex items-center w-full h-full pl-4 pr-24 border-2 rounded-xl border-gray-800 bg-white overflow-hidden cursor-pointer select-none">
                        <input className=" w-full text-lg text-gray-800 outline-none placeholder:text-gray-400"
                            value={remarks} onChange={(e) => { setRemarks(e.target.value) }}
                            placeholder="点击写备注..." />
                    </div>
                    <div className="absolute right-4 top-0 bottom-0 flex items-center">
                        <span className="text-2xl select-none">￥{amountInput || '0.00'}</span>
                    </div>
                </div>
            </div>
        </div>
        {keyMap.map((line, i) => <div key={i} className="flex-1 flex">
            {line.map((key) => <div key={key}
                className="flex-1 px-2 md:px-4 py-2">
                {key === 'd' ? <DateBtn><KDatePicker value={actionTime} onChange={setActionTime} popoverPlacement="left">
                    <div className="relative flex justify-center items-center w-full h-full border-2 rounded-xl border-gray-800 bg-gray-300 overflow-hidden cursor-pointer select-none group">
                        <div className="flex justify-center items-center w-full h-full absolute -top-1 rounded-xl bg-white pointer-events-none group-active:top-0">
                            <span className="text-lg">📅{actionTime.getMonth() + 1}.{actionTime.getDate()}</span>
                        </div>
                    </div>
                </KDatePicker></DateBtn> :
                    <div onClick={() => handleKeyDown(key)}
                        className="relative flex justify-center items-center w-full h-full border-2 rounded-xl border-gray-800 bg-gray-300 overflow-hidden cursor-pointer select-none group">
                        <div className="flex justify-center items-center w-full h-full absolute -top-1 rounded-xl bg-white pointer-events-none group-active:top-0">
                            <span className="text-xl">{keyDomMap[key] || key}</span>
                        </div>
                    </div>
                }
            </div>)}
        </div>)}
    </div>
}

export default BillInput;
