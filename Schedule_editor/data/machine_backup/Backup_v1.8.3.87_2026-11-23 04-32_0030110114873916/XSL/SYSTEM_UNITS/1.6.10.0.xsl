<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	
	<xsl:template match="/system_user_units/groups/rotating_tungsten_distance">
		<rotating_tungsten_distance_setpoint>
			<xsl:apply-templates select="@* | node()" />
		</rotating_tungsten_distance_setpoint>
	</xsl:template>
	
	<xsl:template match="/system_user_units/groups/pulse_time" >
		<xsl:copy-of select="."/>
		<rotating_tungsten_distance_telemetry unit=""/>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>