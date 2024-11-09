import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

import axios from '../../api/axios';

const GameInfoSection = () => {
  const [percentGroup, setPercentGroup] = useState<{
    positive: number;
    negative: number;
  }>({
    positive: 0,
    negative: 0,
  });

  useQuery({
    queryKey: ['reviews', 'metrics', 'count'],
    queryFn: async () => {
      const res = await axios.get('/reviews/metrics/count');
      setPercentGroup({
        positive: res.data.positivePercent,
        negative: res.data.negativePercent,
      });
      return res.data;
    },
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">League of Legends</h1>
        <div>
          <span className="font-medium text-neutral-500">Riot Games</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex-1">
          <div className="aspect-video bg-neutral-300">
            <img src="/images/league-of-legends.png" alt="리그 오브 레전드" />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-8 md:gap-4">
          <p>
            《리그 오브 레전드》는 중국 IT기업 텐센트 산하의 라이엇 게임즈에서
            서비스 및 운영 중인 멀티플레이어 온라인 배틀 아레나 비디오 게임이다.
            리그 오브 레전드의 제작자는 도타 올스타즈의 제작자 중 한 명인 스티브
            피크이며, 워크래프트의 유즈맵 DotA를 바탕으로 제작되었다.
          </p>
          <div className="flex flex-col gap-3 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-500">
                <span className="text-[1.25rem]">
                  <FaThumbsUp />
                </span>
                <span className="text-sm">
                  {Math.round(percentGroup.positive)}%
                </span>
              </div>
              <div className="flex items-center gap-2 text-red-500">
                <span className="text-[1.25rem]">
                  <FaThumbsDown />
                </span>
                <span className="text-sm">
                  {Math.round(percentGroup.negative)}%
                </span>
              </div>
            </div>
            <div className="flex h-[0.25rem] w-full items-center">
              <div
                className="h-full bg-green-500"
                style={{ width: `${Math.round(percentGroup.positive)}%` }}
              />
              <div
                className="h-full bg-red-500"
                style={{ width: `${Math.round(percentGroup.negative)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameInfoSection;
