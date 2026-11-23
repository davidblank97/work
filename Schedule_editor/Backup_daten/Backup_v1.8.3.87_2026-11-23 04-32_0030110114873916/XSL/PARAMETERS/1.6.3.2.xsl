<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='264660']">
		<xsl:copy-of select="."/>
		<param id="202695">
			<name>SERVO 0 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202696">
			<name>SERVO 1 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202697">
			<name>SERVO 2 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202698">
			<name>SERVO 3 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202699">
			<name>SERVO 4 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV VELOCITY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202700">
			<name>SERVO 5 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202701">
			<name>SERVO 6 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
		<param id="202702">
			<name>SERVO 7 REVERSED VELOCITY TELEMETRY</name>
			<short_name>REV TELEMETRY</short_name>
			<desc>An IO point. When enabled, specifies that the telemetry is a different polarity than the setpoint.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>