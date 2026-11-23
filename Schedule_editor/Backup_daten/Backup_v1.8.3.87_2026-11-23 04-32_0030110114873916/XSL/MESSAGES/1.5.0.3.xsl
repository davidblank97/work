<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output  omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='CON']/str[@id='5']"/>
	<xsl:template match="/language[@fileType='CON']/str[@id='6']"/>
	<xsl:template match="/language[@fileType='CON']/str[@id='7']"/>
	<xsl:template match="/language[@fileType='CON']/str[@id='8']"/>
	<xsl:template match="/language[@fileType='CON']/str[@id='9']"/>
	<xsl:template match="/language[@fileType='CON']/str[@id='10']"/>

	<xsl:template match="/language[@fileType='CON']">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<str id="5">
				<text>An internal MQTT error has occurred. Contact Liburdi for additional support.</text>
				<desc>N/A</desc>
			</str>
			<str id="6">
				<text>The connection to the MQTT server was denied due to an invalid protocol version. Contact Liburdi for additional support.</text>
				<desc>N/A</desc>
			</str>
			<str id="7">
				<text>The connection to the MQTT server was denied due to invalid credentials. Contact Liburdi for additional support.</text>
				<desc>N/A</desc>
			</str>
			<str id="8">
				<text>An unknown error occurred while trying to connect to the MQTT server. Please check the status of the server and try to connect again.</text>
				<desc>N/A</desc>
			</str>
			<str id="9">
				<text>The Parameter ID: %1 (added with topic name: %2) is not on the list of approved parameters that can be exported through FireConnect.</text>
				<desc>%1 = Invalid Parameter ID %2 = Topic name that was linked to the parameter ID</desc>
			</str>
			<str id="10">
				<text>An error occured while downloading the files from the %1 server. Check the connection to the network and try again.</text>
				<desc>%1 = Name of the server.</desc>
			</str>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>