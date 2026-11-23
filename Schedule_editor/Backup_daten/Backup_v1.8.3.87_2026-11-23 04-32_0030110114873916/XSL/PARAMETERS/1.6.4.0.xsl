<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='202702']">
		<xsl:copy-of select="."/>
		<param id="265037">
			<name>PRI PULSE TIME</name>
			<short_name>PRI</short_name>
			<desc>The amount of time in the PRIMARY portion of the pulse.</desc>
		</param>
		<param id="265038">
			<name>BKG PULSE TIME</name>
			<short_name>BKG</short_name>
			<desc>The amount of time in the BACKGROUND portion of the pulse.</desc>
		</param>
		<param id="265039">
			<name>PRI MOTION PULSE TIME</name>
			<short_name>PRI</short_name>
			<desc>The amount of time in the PRIMARY portion of the motion pulse.</desc>
		</param>
		<param id="265040">
			<name>BKG MOTION PULSE TIME</name>
			<short_name>BKG</short_name>
			<desc>The amount of time in the BACKGROUND portion of the motion pulse.</desc>
		</param>
		<param id="264772">
			<name>PULSE TIME OVERRIDE MAX</name>
			<short_name>MAX PULSE TIME</short_name>
			<desc>The maximum value, expressed as a present, that a user can adjust the value of the PULSE TIME set point to while welding.</desc>
		</param>
		<param id="264773">
			<name>PULSE TIME OVERRIDE RATE</name>
			<short_name>PULSE TIME RATE</short_name>
			<desc>The rate at which the set point value for PULSE TIME set point will be adjusted every time a user overrides the parameter while welding.</desc>
		</param>
		<param id="264774">
			<name>MOTION PULSE TIME OVERRIDE MAX</name>
			<short_name>MAX MOTION PULSE TIME</short_name>
			<desc>The maximum value, expressed as a present, that a user can adjust the value of the MOTION PULSE TIME set point to while welding.</desc>
		</param>
		<param id="264775">
			<name>MOTION PULSE TIME OVERRIDE RATE</name>
			<short_name>MOTION PULSE TIME RATE</short_name>
			<desc>The rate at which the set point value for MOTION PULSE TIME set point will be adjusted every time a user overrides the parameter while welding.</desc>
		</param>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>