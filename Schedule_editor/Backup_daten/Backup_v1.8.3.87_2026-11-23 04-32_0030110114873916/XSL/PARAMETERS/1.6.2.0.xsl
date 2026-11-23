<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='264982']">
		<xsl:copy-of select="."/>
		<param id="265035">
			<name>WIRE MANIPULATOR WIDTH</name>
			<short_name>WIDTH</short_name>
			<desc>The total width of the wire manipulator oscillation. This parameter will only display if the selected weld head has wire manipulator oscillation capability.</desc>
		</param>
		<param id="265036">
			<name>TUNGSTEN WIDTH</name>
			<short_name>WIDTH</short_name>
			<desc>The total width of the tungsten oscillation. This parameter will only display if the selected weld head has tungsten oscillation capability.</desc>
		</param>	
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='264626']">
		<xsl:copy-of select="."/>
		<param id="264627">
			<name>ROTATING TUNGSTEN JOG</name>
			<short_name>JOG</short_name>
			<desc>The speed at which the tungsten axis will move while the operator is moving from one position to another. Jogging means positioning the axis while the system is not welding.</desc>
		</param>
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='264658']">
		<xsl:copy-of select="."/>
		<param id="264659">
			<name>ROTATING TUNGSTEN STEP</name>
			<short_name>STEP</short_name>
			<desc>The distance the tungsten will move when the step function is used. A step function is when a user commands the robot to move a specified distance in a given direction, usually to make fine positions moves.</desc>
		</param>	
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='264765']">
		<xsl:copy-of select="."/>
		<param id="264766">
			<name>WIRE MANIPULATOR WIDTH MAX</name>
			<short_name></short_name>
			<desc>The maximum value that a user can adjust the value of the wire manipulator width set point to while welding.</desc>
		</param>
		<param id="264767">
			<name>WIRE MANIPULATOR WIDTH RATE</name>
			<short_name></short_name>
			<desc>The rate at which the width set point value for wire manipulator will be adjusted every time a user overrides the parameter while welding.</desc>
		</param>
		<param id="264768">
			<name>ROTATING TUNGSTEN WIDTH MAX</name>
			<short_name></short_name>
			<desc>The maximum value that a user can adjust the value of the tungsten width set point to while welding.</desc>
		</param>
		<param id="264769">
			<name>ROTATING TUNGSTEN WIDTH RATE</name>
			<short_name></short_name>
			<desc>The rate at which the width set point value for tungsten axis will be adjusted every time a user overrides the parameter while welding.</desc>
		</param>		
	</xsl:template>
	
	<xsl:template match="/Parameters/param[@id='264682']">
		<xsl:copy-of select="."/>
		<param id="264683">
			<name>WIRE MANIPULATOR IN/OUT PRE POSITION</name>
			<short_name></short_name>
			<desc>The position that the wire manipulator axis will move to before a weld has started. Used to automatically position the weld head.</desc>
		</param>
		<param id="264684">
			<name>WIRE MANIPULATOR IN/OUT POST POSITION</name>
			<short_name></short_name>
			<desc>The distance that the wire manipulator axis will move after weld is completer. Used to automatically position the weld head.</desc>
		</param>
		<param id="264685">
			<name>ROTATING TUNGSTEN PRE POSITION</name>
			<short_name></short_name>
			<desc>The position that the tungsten axis will move to before a weld has started. Used to automatically position the weld head.</desc>
		</param>
		<param id="264686">
			<name>ROTATING TUNGSTEN POST POSITION</name>
			<short_name></short_name>
			<desc>The distance that the tungsten axis will move after weld is completer. Used to automatically position the weld head.</desc>
		</param>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>