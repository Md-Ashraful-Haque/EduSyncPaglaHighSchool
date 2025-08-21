from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import ExamForIMS, Class
from .utils import generate_result_using_institue_to_group

class ResultGenerationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if self.scope['user'].is_authenticated:
            await self.accept()
        else:
            await self.close(code=403, reason="Authentication required")

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            institute_id = data.get('institute_id')
            year = data.get('year')
            exam_name = data.get('exam_name')
            shift = data.get('shift')

            if not all([institute_id, year, exam_name, shift]):
                await self.send(text_data=json.dumps({
                    'message': 'Missing required fields: institute_id, year, exam_name, or shift',
                    'status': 'error'
                }))
                return

            # Fetch exam
            exam = ExamForIMS.objects.filter(id=exam_name).first()
            if not exam:
                await self.send(text_data=json.dumps({
                    'message': f'Exam with ID {exam_name} not found',
                    'status': 'error'
                }))
                return

            # Fetch classes
            classes = Class.objects.filter(
                institute__id=institute_id,
                year__year=year,
                shift=shift,
                examforims=exam
            ).select_related('class_name').prefetch_related('groups')

            if not classes.exists():
                await self.send(text_data=json.dumps({
                    'message': f'No classes found for institute {institute_id}, year {year}, shift {shift}',
                    'status': 'error'
                }))
                return

            # Process classes and groups
            for class_obj in classes:
                for group in class_obj.groups.all():
                    await self.send(text_data=json.dumps({
                        'message': f'Started generating result for class {class_obj.class_name.name}, group {group.group_name}',
                        'status': 'start'
                    }))
                    try:
                        generate_result_using_institue_to_group(
                            institute_id, year, class_obj.class_name.name, group.group_name, exam_name
                        )
                        await self.send(text_data=json.dumps({
                            'message': f'Completed generating result for class {class_obj.class_name.name}, group {group.group_name}',
                            'status': 'complete'
                        }))
                    except Exception as e:
                        await self.send(text_data=json.dumps({
                            'message': f'Error for class {class_obj.class_name.name}, group {group.group_name}: {str(e)}',
                            'status': 'error'
                        }))

            await self.send(text_data=json.dumps({
                'message': f'Results generated for {classes.count()} classes',
                'status': 'success'
            }))

        except Exception as e:
            await self.send(text_data=json.dumps({
                'message': f'An unexpected error occurred: {str(e)}',
                'status': 'error'
            }))