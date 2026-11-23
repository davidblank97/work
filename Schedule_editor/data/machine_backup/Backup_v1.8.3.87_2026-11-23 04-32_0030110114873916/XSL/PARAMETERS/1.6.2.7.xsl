<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='199425']">
		<xsl:copy-of select="."/>
		<param id="202693">
			<name>AUX POWER 3 ENABLE</name>
			<short_name>ENABLE</short_name>
			<desc>An IO point. Enables/disables one of the auxiliary power supplies.</desc>
		</param>
		<param id="202694">
			<name>PILOT ARC ON</name>
			<short_name/>
			<desc>An IO point. Detects if the pilot arc power supply is in regulation.</desc>
		</param>
		<param id="268299">
			<name>AUX POWER 3 AMPERAGE SETPOINT</name>
			<short_name>AMPERAGE SETPOINT</short_name>
			<desc>An IO point. AUX short for 'Auxiliary'. Determines the amperage that the secondary auxiliary power supply will output when enabled.</desc>
		</param>
		<param id="268300">
			<name>AUX POWER 3 AMPERAGE PRI SETPOINT</name>
			<short_name>AMPERAGE PRI SETPOINT</short_name>
			<desc>An IO point. AUX short for 'Auxiliary'. Determines the amperage that the secondary auxiliary power supply will output during the PRIMARY portion of the pulsation cycle. Used when pulsation is enabled.</desc>
		</param>
		<param id="268301">
			<name>AUX POWER 3 AMPERAGE BKG SETPOINT</name>
			<short_name>AMPERAGE BKG SETPOINT</short_name>
			<desc>An IO point. AUX short for 'Auxiliary'. Determines the amperage that the secondary auxiliary power supply will output during the BACKGROUND portion of the pulsation cycle. Used when pulsation is enabled.</desc>
		</param>
		<param id="268302">
			<name>AUX POWER 3 AMPERAGE TELEMETRY</name>
			<short_name>AMPERAGE TELEMETRY</short_name>
			<desc>An IO point. AUX short for 'Auxiliary'. Determines the amperage that the secondary auxiliary power supply will output when enabled.</desc>
		</param>
		<param id="268303">
			<name>AUX POWER 3 AMPERAGE PRI TELEMETRY</name>
			<short_name>AMPERAGE PRI TELEMETRY</short_name>
			<desc>An IO point. AUX short for 'Auxiliary'. Provides the system with an accurate measurement of the amperage output from the secondary auxiliary power supply during the PRIMARY portion of the pulsation cycle. Used when pulsation is enabled.</desc>
		</param>
		<param id="268304">
			<name>AUX POWER 3 AMPERAGE BKG TELEMETRY</name>
			<short_name>AMPERAGE BKG TELEMETRY</short_name>
			<desc>An IO point. AUX short for 'Auxiliary'. Provides the system with an accurate measurement of the amperage output from the secondary auxiliary power supply during the BACKGROUND portion of the pulsation cycle. Used when pulsation is enabled.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>